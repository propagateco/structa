export const getImageUrl = (
	src: string | null | undefined,
	format?: string,
) => {
	if (!src) {
		return undefined;
	}
	const isLocalUrl = src.startsWith("blob:");
	if (isLocalUrl) {
		return src;
	} else {
		return `${src}${format}`;
	}
};
