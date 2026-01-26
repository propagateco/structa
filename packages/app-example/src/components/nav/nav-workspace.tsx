import type { BrandingModel } from "@core/branding/branding.model";
import type { UserModel } from "@core/user/user.model";
import { formatWorkspaceName } from "@core/utils/string";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { brandingChangesAtom } from "@/state/branding";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getImageUrl } from "../ui/image";
import { SidebarMenuButton } from "../ui/sidebar";

export function NavWorkspace({
	user,
	branding,
}: {
	user: UserModel.UserType;
	branding: BrandingModel.BrandingQueryType;
}) {
	// Use direct Jotai atoms for live preview data
	const changes = useAtomValue(brandingChangesAtom);

	// Implement three-state icon handling (following iphone.tsx pattern)
	const iconUrl = (() => {
		if (changes.icon instanceof File) {
			return URL.createObjectURL(changes.icon);
		} else if (changes.icon === null) {
			return null;
		} else {
			return branding.icon;
		}
	})();

	return (
		<SidebarMenuButton size="sm" asChild className="w-auto">
			<Link to="/">
				<div className="flex aspect-square size-5 items-center justify-center rounded-md text-sidebar-primary-foreground overflow-hidden">
					<Avatar className="h-5 w-5 rounded-none">
						<AvatarImage
							src={
								iconUrl
									? getImageUrl(iconUrl, "?width=280&height=280&format=webp")
									: undefined
							}
							alt={user.workspaceName}
						/>
						<AvatarFallback className="bg-sidebar-primary rounded-none">
							{formatWorkspaceName(user.workspaceName)}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="text-left text-sm leading-tight">
					<span className="truncate font-semibold">{user.workspaceName}</span>
				</div>
			</Link>
		</SidebarMenuButton>
	);
}
