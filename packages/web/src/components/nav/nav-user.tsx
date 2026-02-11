import type { UserModel } from "@core/user/user.model";
import { Link, useRouter } from "@tanstack/react-router";
import {
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Settings,
	Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { formatPlan, formatToInitials } from "@/lib/string-utils";
import { getImageUrl } from "../ui/image";

export function NavUser({ user }: { user: UserModel.UserType }) {
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.invalidate();
		window.location.href = "/login";
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={getImageUrl(
										user.image,
										"?width=400&height=400&format=webp",
									)}
									alt={user.name}
								/>
								<AvatarFallback>{formatToInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user.name}</span>
								<span className="truncate text-xs">
									{formatPlan(user.plan)}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg text-sidebar-foreground"
						side="top"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8">
									<AvatarImage
										src={getImageUrl(
											user.image,
											"?width=400&height=400&format=webp",
										)}
										alt={user.name}
									/>
									<AvatarFallback>{formatToInitials(user.name)}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
							<DropdownMenuSeparator />
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							{user.plan !== "pro" && (
								<>
									<DropdownMenuItem>
										<Sparkles />
										Upgrade to Pro
									</DropdownMenuItem>
									<DropdownMenuSeparator />
								</>
							)}
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							{/* TODO: Uncomment when settings routes are implemented in web package
							<DropdownMenuItem asChild>
								<Link to="/settings/account">
									<Settings />
									Settings
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/settings/notifications">
									<Bell />
									Notifications
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link to="/settings/billing">
									<CreditCard />
									Billing
								</Link>
							</DropdownMenuItem>
							*/}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
