// Polyfill for Buffer in browser environment (required by gray-matter)
if (typeof window !== 'undefined') {
  (window as any).Buffer = {
    from: function(data: string | Uint8Array, encoding?: string): Uint8Array {
      if (typeof data === 'string') {
        if (encoding === 'hex') {
          const hexString = data.replace(/\s/g, '');
          const bytes = new Uint8Array(hexString.length / 2);
          for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
          }
          return bytes;
        }
        if (encoding === 'base64') {
          const binaryString = atob(data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes;
        }
        const encoder = new TextEncoder();
        return encoder.encode(data);
      }
      return new Uint8Array(data);
    },
    isBuffer: function(obj: unknown): boolean {
      return obj instanceof Uint8Array;
    },
    byteLength: function(data: string | Uint8Array): number {
      if (typeof data === 'string') {
        return new Blob([data]).size;
      }
      return data.length;
    },
    concat: function(list: Uint8Array[]): Uint8Array {
      const totalLength = list.reduce((acc, buf) => acc + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of list) {
        result.set(buf, offset);
        offset += buf.length;
      }
      return result;
    },
    alloc: function(size: number): Uint8Array {
      return new Uint8Array(size);
    },
    allocUnsafe: function(size: number): Uint8Array {
      return new Uint8Array(size);
    },
  } as any;
}
