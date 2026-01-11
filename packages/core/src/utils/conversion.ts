export function convertMegabytesToBytes(mb: number): number {
	if (mb < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(mb * 1024 * 1024);
}

export function convertBytesToMegabytes(bytes: number): number {
	if (bytes < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(bytes / 1024 / 1024);
}

export function convertKilobytesToBytes(kb: number): number {
	if (kb < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(kb * 1024);
}
export function convertBytesToKilobytes(bytes: number): number {
	if (bytes < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(bytes / 1024);
}

export function convertGigabytesToBytes(gb: number): number {
	if (gb < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(gb * 1024 * 1024 * 1024);
}
export function convertBytesToGigabytes(bytes: number): number {
	if (bytes < 0) {
		throw new Error('Size cannot be negative');
	}
	return Math.floor(bytes / 1024 / 1024 / 1024);
}

export function convertSecondsToMilliseconds(seconds: number): number {
	if (seconds < 0) {
		throw new Error('Time cannot be negative');
	}
	return Math.floor(seconds * 1000);
}
