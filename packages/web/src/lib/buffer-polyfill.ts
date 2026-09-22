type BufferTarget = {
	Buffer?: unknown;
};

/** Install the smallest callable Buffer-compatible surface used by the web app. */
export function installBufferPolyfill(target: BufferTarget) {
	if (typeof target.Buffer === "function") {
		return;
	}

	class BrowserBuffer extends Uint8Array {}

	const from = (data: string | Uint8Array, encoding?: string) => {
		if (typeof data !== "string") {
			return new BrowserBuffer(data);
		}

		if (encoding === "hex") {
			const hexString = data.replace(/\s/g, "");
			const bytes = new BrowserBuffer(hexString.length / 2);
			for (let i = 0; i < hexString.length; i += 2) {
				bytes[i / 2] = Number.parseInt(hexString.slice(i, i + 2), 16);
			}
			return bytes;
		}

		if (encoding === "base64") {
			const binaryString = atob(data);
			const bytes = new BrowserBuffer(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}
			return bytes;
		}

		return new BrowserBuffer(new TextEncoder().encode(data));
	};

	Object.assign(BrowserBuffer, {
		from,
		isBuffer: (value: unknown) => value instanceof Uint8Array,
		byteLength: (data: string | Uint8Array) =>
			typeof data === "string" ? new Blob([data]).size : data.length,
		concat: (list: Uint8Array[]) => {
			const totalLength = list.reduce((total, value) => total + value.length, 0);
			const result = new BrowserBuffer(totalLength);
			let offset = 0;
			for (const value of list) {
				result.set(value, offset);
				offset += value.length;
			}
			return result;
		},
		alloc: (size: number) => new BrowserBuffer(size),
		allocUnsafe: (size: number) => new BrowserBuffer(size),
	});

	target.Buffer = BrowserBuffer;
}

if (typeof window !== "undefined") {
	installBufferPolyfill(window);
}
