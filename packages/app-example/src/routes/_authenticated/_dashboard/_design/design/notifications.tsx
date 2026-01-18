import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_dashboard/_design/design/notifications')({
	component: RouteComponent,
	staticData: {
		title: 'Notifications',
	},
});

function RouteComponent() {
	return <div>Display notifications components here</div>;
}
