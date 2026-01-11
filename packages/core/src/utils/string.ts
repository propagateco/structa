export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const splitIntoFirstAndLastName = (str: string) => {
	const [firstName, ...rest] = str.split(' ');
	const lastName = rest.length > 0 ? rest.join(' ') : undefined;
	return { firstName, lastName };
};

export const formatToInitials = (str: string | null | undefined) => {
	if (!str) return '';
	return (
		str
			.split(' ')
			.flatMap((chunk) => chunk.charAt(0).toLocaleUpperCase())
			.slice(0, 2)
			.join('') || str.slice(0, 2).toLocaleUpperCase()
	);
};

export const formatWorkspaceName = (workspaceName: string) => {
	return workspaceName.slice(0, 1).toLocaleUpperCase();
};

export const formatPlan = (plan: string | null | undefined) => {
	if (!plan) return 'Free Trial';
	switch (plan) {
		case 'trial':
			return 'Free Trial';
		case 'pro':
			return 'Pro Plan';
		default:
			return 'Free Trial';
	}
};
