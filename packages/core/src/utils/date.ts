export function formatTimeSince(timestamp: string | Date): string {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return `${diffInSeconds} ${diffInSeconds === 1 ? 'second ago' : 'seconds ago'}`;
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute ago' : 'minutes ago'}`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? 'hour ago' : 'hours ago'}`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 3) {
		return `${diffInDays} ${diffInDays === 1 ? 'day ago' : 'days ago'}`;
	}

	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
	});
}
export function convertStringFieldsToDate(obj: any, dateFields: string[]): any {
	const result = { ...obj };
	for (const field of dateFields) {
		if (result[field]) {
			result[field] = new Date(result[field]);
		}
	}
	return result;
}
