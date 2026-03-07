import { Link } from "@tanstack/react-router";
import { Slash } from "lucide-react";
import { Fragment, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResponsiveBreadcrumbs({
	crumbs,
	base,
	dynamicTitle,
}: {
	crumbs: { title: string; path: string }[];
	base?: { title: string; path: string };
	dynamicTitle?: string;
}) {
	const MAX_CRUMBS_TO_DISPLAY = 3;
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{crumbs.length > MAX_CRUMBS_TO_DISPLAY ? (
					<>
						<BreadcrumbItem>
							{!isMobile ? (
								<DropdownMenu open={open} onOpenChange={setOpen}>
									<DropdownMenuTrigger
										className="flex items-center gap-1"
										aria-label="Toggle menu"
									>
										<BreadcrumbEllipsis className="h-4 w-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										{crumbs.slice(1, -2).map((crumb) => (
											<DropdownMenuItem key={crumb.path}>
												<Link to={crumb.path}>{crumb.title}</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Drawer open={open} onOpenChange={setOpen}>
									<DrawerTrigger aria-label="Toggle Menu">
										<BreadcrumbEllipsis className="h-4 w-4" />
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader className="text-left">
											<DrawerTitle>Navigate to</DrawerTitle>
											<DrawerDescription>
												Select a page to navigate to.
											</DrawerDescription>
										</DrawerHeader>
										<div className="grid gap-1 px-4">
											{crumbs.slice(1, -2).map((crumb) => (
												<Link
													key={crumb.path}
													to={crumb.path}
													className="py-1 text-sm"
												>
													{crumb.title}
												</Link>
											))}
										</div>
										<DrawerFooter className="pt-4">
											<DrawerClose asChild>
												<Button variant="outline">Close</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							)}
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<Slash />
						</BreadcrumbSeparator>
					</>
				) : null}
				{base && (
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
							<Link to={base.path}>{base.title}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				)}

				{crumbs.slice(-MAX_CRUMBS_TO_DISPLAY + 1).map((crumb, index, array) => (
					<Fragment key={`fragment-${crumb.path}`}>
						{(base || index > 0) && (
							<BreadcrumbSeparator key={`separator-${crumb.path}`}>
								<Slash />
							</BreadcrumbSeparator>
						)}
						<BreadcrumbItem key={`crumb-${crumb.path}`}>
							{index === array.length - 1 ? (
								<BreadcrumbPage
									className="max-w-20 truncate md:max-w-none"
									key={`page-${crumb.path}`}
								>
									{dynamicTitle ? dynamicTitle : crumb.title}
								</BreadcrumbPage>
							) : (
								<>
									<BreadcrumbLink
										asChild
										className="max-w-20 truncate md:max-w-none"
										key={`crumblink-${crumb.path}`}
									>
										<Link to={crumb.path}>{crumb.title}</Link>
									</BreadcrumbLink>
								</>
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
