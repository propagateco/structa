/**
 * Tests for Electric Proxy Utility
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock SST Resource
vi.mock("sst", () => ({
	Resource: {
		SyncEngine: {
			source: "svc-test-source-id",
			secret: "test-electric-secret-12345",
		},
	},
}));

// Import after mocking
import {
	buildElectricUpstreamUrl,
	getElectricSecret,
	getElectricSourceId,
	proxyToElectric,
} from "../electric-proxy";

describe("Electric Proxy Utility", () => {
	describe("getElectricSourceId", () => {
		it("returns the Electric source ID", () => {
			const sourceId = getElectricSourceId();
			expect(sourceId).toBe("svc-test-source-id");
		});
	});

	describe("getElectricSecret", () => {
		it("returns the Electric secret", () => {
			const secret = getElectricSecret();
			expect(secret).toBe("test-electric-secret-12345");
		});
	});

	describe("buildElectricUpstreamUrl", () => {
		it("builds URL with required Electric parameters", () => {
			const request = new Request("http://localhost:3000/api/users");
			const url = buildElectricUpstreamUrl(request, "user");

			expect(url.origin).toBe("https://api.electric-sql.cloud");
			expect(url.pathname).toBe("/v1/shape");
			expect(url.searchParams.get("table")).toBe("user");
			expect(url.searchParams.get("secret")).toBe("test-electric-secret-12345");
			expect(url.searchParams.get("source_id")).toBe("svc-test-source-id");
		});

		it("includes where clause when provided", () => {
			const request = new Request("http://localhost:3000/api/users");
			const url = buildElectricUpstreamUrl(request, "user", "id = 'user-123'");

			expect(url.searchParams.get("where")).toBe("id = 'user-123'");
		});

		it("passes through Electric protocol parameters", () => {
			const request = new Request(
				"http://localhost:3000/api/users?offset=100&handle=abc123&live=true",
			);
			const url = buildElectricUpstreamUrl(request, "user");

			expect(url.searchParams.get("offset")).toBe("100");
			expect(url.searchParams.get("handle")).toBe("abc123");
			expect(url.searchParams.get("live")).toBe("true");
		});

		it("ignores non-Electric protocol parameters", () => {
			const request = new Request(
				"http://localhost:3000/api/users?foo=bar&custom=value",
			);
			const url = buildElectricUpstreamUrl(request, "user");

			expect(url.searchParams.get("foo")).toBeNull();
			expect(url.searchParams.get("custom")).toBeNull();
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
