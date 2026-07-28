import type { SchemaType } from "@structa/core/user/user.model";
import { Link, useRouter } from "@tanstack/react-router";
import {
    Bell,
    ChevronsUpDown,
    Cog,
    Contrast,
    CreditCard,
    DoorOpen,
    UserCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { formatPlan, formatToInitials } from "@/lib/string-utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function NavUser({ user }: { user: SchemaType }) {
    const { isMobile } = useSidebar();
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
                            className="data-[state=open]:bg-secondary data-[state=open]:text-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                    src={user.image ?? undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-full">
                                    {formatToInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-base">
                                <span className="truncate font-normal text-foreground">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {formatPlan(user.plan)}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-full">
                                    <AvatarImage
                                        src={user.image ?? undefined}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {formatToInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left">
                                    <span className="truncate text-sm font-medium text-text">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to="/settings/account">
                                    <UserCircle />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings/account">
                                    <Cog />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings/billing">
                                    <CreditCard />
                                    Subscription
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/settings/notifications">
                                    <Bell />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="py-1 justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Contrast className="size-4" />
                                    Appearance
                                </span>
                                <ThemeToggle variant="default" size="xs" />
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={handleSignOut}
                        >
                            <DoorOpen />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
