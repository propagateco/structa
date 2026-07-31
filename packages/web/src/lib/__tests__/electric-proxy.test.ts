/**
 * Tests for Electric Proxy Utility
 */

import { Resource } from "sst";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock SST Resource. The object is mutable so tests can exercise both the
// static-link path (dev/production) and the runtime-resolution path
// (preview stages, where SyncEngine has no baked properties).
vi.mock("sst", () => ({
	Resource: {
		App: { name: "structa", stage: "pr-99" },
		SyncEngine: {
			type: "sst.sst.Linkable",
			source: "svc-test-source-id",
			secret: "test-electric-secret-12345",
		},
		ElectricCloudApiToken: { value: "test-electric-token-12345" },
		ElectricCloudProjectId: { value: "proj-test-project-12345" },
	},
}));

type MockResource = {
	App: { stage: string };
	SyncEngine?: { type: string; source?: string; secret?: string };
	ElectricCloudApiToken: { value: string };
	ElectricCloudProjectId: { value: string };
};
const mockResource = Resource as unknown as MockResource;

// Import after mocking
import {
	buildElectricUpstreamUrl,
	getElectricSecret,
	getElectricSourceId,
	proxyToElectric,
	resetElectricCredentialsCache,
} from "../electric-proxy";

describe("Electric Proxy Utility", () => {
	beforeEach(() => {
		resetElectricCredentialsCache();
		// Restore the static-link shape for tests that rely on it.
		mockResource.SyncEngine = {
			type: "sst.sst.Linkable",
			source: "svc-test-source-id",
			secret: "test-electric-secret-12345",
		};
	});

	describe("getElectricSourceId", () => {
		it("returns the Electric source ID", async () => {
			const sourceId = await getElectricSourceId();
			expect(sourceId).toBe("svc-test-source-id");
		});
	});

	describe("getElectricSecret", () => {
		it("returns the Electric secret", async () => {
			const secret = await getElectricSecret();
			expect(secret).toBe("test-electric-secret-12345");
		});
	});

	describe("buildElectricUpstreamUrl", () => {
		it("builds URL with required Electric parameters", async () => {
			const request = new Request("http://localhost:3000/api/users");
			const url = await buildElectricUpstreamUrl(request, "user");

			expect(url.origin).toBe("https://api.electric-sql.cloud");
			expect(url.pathname).toBe("/v1/shape");
			expect(url.searchParams.get("table")).toBe("user");
			expect(url.searchParams.get("secret")).toBe("test-electric-secret-12345");
			expect(url.searchParams.get("source_id")).toBe("svc-test-source-id");
		});

		it("includes where clause when provided", async () => {
			const request = new Request("http://localhost:3000/api/users");
			const url = await buildElectricUpstreamUrl(
				request,
				"user",
				"id = 'user-123'",
			);

			expect(url.searchParams.get("where")).toBe("id = 'user-123'");
		});

		it("passes through Electric protocol parameters", async () => {
			const request = new Request(
				"http://localhost:3000/api/users?offset=100&handle=abc123&live=true",
			);
			const url = await buildElectricUpstreamUrl(request, "user");

			expect(url.searchParams.get("offset")).toBe("100");
			expect(url.searchParams.get("handle")).toBe("abc123");
			expect(url.searchParams.get("live")).toBe("true");
		});

		it("ignores non-Electric protocol parameters", async () => {
			const request = new Request(
				"http://localhost:3000/api/users?foo=bar&custom=value",
			);
			const url = await buildElectricUpstreamUrl(request, "user");

			expect(url.searchParams.get("foo")).toBeNull();
			expect(url.searchParams.get("custom")).toBeNull();
		});
	});

	describe("runtime resolution (preview stages)", () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("resolves source + secret from the Electric Cloud API when the link is empty", async () => {
			// Preview stage: SyncEngine exists but carries no baked properties.
			mockResource.SyncEngine = { type: "sst.sst.Linkable" };

			vi.spyOn(global, "fetch").mockImplementation((input) => {
				const url = input instanceof Request ? input.url : String(input);
				if (url.endsWith("/environments/list")) {
					return Promise.resolve(
						new Response(
							JSON.stringify({
								json: {
									environments: [
										{ id: "env-preview-1", name: "preview-pr-99" },
									],
								},
							}),
						),
					);
				}
				if (url.endsWith("/services/list")) {
					return Promise.resolve(
						new Response(
							JSON.stringify({
								json: {
									services: [
										{ id: "svc-runtime-source", name: "postgres-sync" },
									],
								},
							}),
						),
					);
				}
				if (url.endsWith("/services/getSecret")) {
					return Promise.resolve(
						new Response(
							JSON.stringify({ json: { secret: "runtime-secret-67890" } }),
						),
					);
				}
				throw new Error(`Unexpected fetch: ${url}`);
			});

			expect(await getElectricSourceId()).toBe("svc-runtime-source");
			expect(await getElectricSecret()).toBe("runtime-secret-67890");
		});

		it("throws when the stage environment does not exist", async () => {
			mockResource.SyncEngine = { type: "sst.sst.Linkable" };

			vi.spyOn(global, "fetch").mockImplementation(() =>
				Promise.resolve(
					new Response(JSON.stringify({ json: { environments: [] } })),
				),
			);

			await expect(getElectricSourceId()).rejects.toThrow(
				"Electric Cloud environment 'preview-pr-99' not found",
			);
		});
	});

	describe("proxyToElectric", () => {
		beforeEach(() => {
			vi.spyOn(global, "fetch").mockImplementation(
				() =>
					Promise.resolve(
						new Response(JSON.stringify({ data: "test" }), {
							status: 200,
							statusText: "OK",
							headers: {
								"content-type": "application/json",
								"content-encoding": "gzip",
								"content-length": "123",
							},
						}),
					) as Promise<Response>,
			);
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it("fetches from the upstream URL", async () => {
			const url = new URL("https://api.electric-sql.cloud/v1/shape?table=user");
			await proxyToElectric(url);

			expect(global.fetch).toHaveBeenCalledWith(url);
		});

		it("removes content-encoding header", async () => {
			const url = new URL("https://api.electric-sql.cloud/v1/shape?table=user");
			const response = await proxyToElectric(url);

			expect(response.headers.get("content-encoding")).toBeNull();
		});

		it("removes content-length header", async () => {
			const url = new URL("https://api.electric-sql.cloud/v1/shape?table=user");
			const response = await proxyToElectric(url);

			expect(response.headers.get("content-length")).toBeNull();
		});

		it("adds Vary header for cookie-based auth", async () => {
			const url = new URL("https://api.electric-sql.cloud/v1/shape?table=user");
			const response = await proxyToElectric(url);

			expect(response.headers.get("Vary")).toBe("Cookie");
		});

		it("preserves response status and body", async () => {
			const url = new URL("https://api.electric-sql.cloud/v1/shape?table=user");
			const response = await proxyToElectric(url);

			expect(response.status).toBe(200);
			expect(response.statusText).toBe("OK");
		});
	});
});
