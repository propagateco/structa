import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_dashboard/_design/design/layout')({
	component: RouteComponent,
	staticData: {
		title: 'Layouts',
	},
});

function RouteComponent() {
	return <div>Display layout components here</div>;
}
