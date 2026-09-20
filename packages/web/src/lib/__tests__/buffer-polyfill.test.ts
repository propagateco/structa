import { describe, expect, it } from "vitest";
import { installBufferPolyfill } from "../buffer-polyfill";

describe("installBufferPolyfill", () => {
	it("installs a callable Buffer constructor for instanceof checks", () => {
		const target: { Buffer?: unknown } = {};

		installBufferPolyfill(target);

		const BufferConstructor = target.Buffer as typeof Uint8Array & {
			from(data: string): Uint8Array;
		};
		const value = BufferConstructor.from("hello");

		expect(typeof BufferConstructor).toBe("function");
		expect(value).toBeInstanceOf(BufferConstructor);
	});
});
