import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/_dashboard/_design/design/pages')({
	component: RouteComponent,
	staticData: {
		title: 'Pages',
	},
});

function RouteComponent() {
	return <div>Display pages here</div>;
}
