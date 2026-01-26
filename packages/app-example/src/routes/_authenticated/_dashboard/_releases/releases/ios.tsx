import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
// import { Helmet } from 'react-helmet';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute(
	"/_authenticated/_dashboard/_releases/releases/ios",
)({
	component: RouteComponent,
	staticData: {
		title: "Apple App Store",
	},
});

function RouteComponent() {
	return (
		<>
			{/* <Helmet>
				<title>Apple App Store | Structa</title>
			</Helmet> */}
			<p>App Store</p>
		</>
	);
}
