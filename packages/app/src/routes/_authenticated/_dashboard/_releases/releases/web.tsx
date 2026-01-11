import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_dashboard/_releases/releases/web')({
	component: RouteComponent,
	staticData: {
		title: 'Web',
	},
});

function RouteComponent() {
	return <div>Web</div>;
}
