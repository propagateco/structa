import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_dashboard/_releases/releases/android')({
	component: RouteComponent,
	staticData: {
		title: 'Google Play Store',
	},
});

function RouteComponent() {
	return <div>Google Play Store</div>;
}
