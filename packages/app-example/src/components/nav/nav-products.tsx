import { Link } from "@tanstack/react-router";
import {
	Folder,
	type LucideIcon,
	MoreHorizontal,
	Pencil,
	Plus,
	Share,
	Trash2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavProducts({
	products,
	onCreateProduct,
	onDeleteProduct,
}: {
	products: {
		id: string;
		name: string;
		url: string;
		icon?: LucideIcon;
	}[];
	onCreateProduct?: () => void;
	onDeleteProduct?: (id: string) => void;
}) {
	const isMobile = useIsMobile();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [productToDelete, setProductToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Products</SidebarGroupLabel>
			<SidebarMenu>
				{products.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<Link to={item.url}>
								{item.icon && <item.icon />}
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem asChild>
									<Link to={item.url}>
										<Pencil />
										<span>Edit Product</span>
									</Link>
								</DropdownMenuItem>
								{/* <DropdownMenuItem>
                  <Upload />
                  <span>Publish Product</span>
                </DropdownMenuItem> */}
								{/* <DropdownMenuSeparator /> */}
								<DropdownMenuItem
									destructive
									onSelect={(e) => {
										e.preventDefault();
										setProductToDelete({ id: item.id, name: item.name });
										setDeleteDialogOpen(true);
									}}
								>
									<Trash2 />
									<span>Delete Product</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
				{onCreateProduct && (
					<SidebarMenuItem>
						<SidebarMenuButton onClick={onCreateProduct}>
							<Plus />
							<span>Create product</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				)}
			</SidebarMenu>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							product "{productToDelete?.name}" and all its associated content.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setProductToDelete(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (productToDelete && onDeleteProduct) {
									onDeleteProduct(productToDelete.id);
									setProductToDelete(null);
									setDeleteDialogOpen(false);
								}
							}}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SidebarGroup>
	);
}
