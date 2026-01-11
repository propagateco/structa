import { PageContainer } from '@/components/layout/container';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
// import { Helmet } from 'react-helmet';
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/_authenticated/_dashboard/_releases/releases/ios')({
	component: RouteComponent,
	staticData: {
		title: 'Apple App Store',
	},
});

function RouteComponent() {
	return (
		<>
			{/* <Helmet>
				<title>Apple App Store | Propagate</title>
			</Helmet> */}
			<p>App Store</p>
		</>
	);
}
