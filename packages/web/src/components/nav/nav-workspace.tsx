// TODO: STUB - Replace with actual BrandingModel from @core/branding/branding.model when available
// Currently using stub types until branding model is implemented
// TODO: STUB - Replace with actual Jotai state when branding state is implemented
// Currently using stub data until Jotai is available

export interface BrandingModelStub {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
}

import type { UserModel } from "@core/user/user.model";
import { Link } from "@tanstack/react-router";
import { formatWorkspaceName } from "@/lib/string-utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getImageUrl } from "../ui/image";
import { SidebarMenuButton } from "../ui/sidebar";

// TODO: STUB - Replace with actual Jotai atom when branding state is implemented
const MOCK_BRANDING_CHANGES = { icon: null as File | null };

export function NavWorkspace({
	user,
	branding,
}: {
	user: UserModel.UserType;
	branding: BrandingModelStub;
}) {
	// TODO: STUB - Replace with actual Jotai atom value when branding state is implemented
	// Currently using mock data
	const changes = MOCK_BRANDING_CHANGES;

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
							alt={user.workspaceName || ""}
						/>
						<AvatarFallback className="bg-sidebar-primary rounded-none">
							{formatWorkspaceName(user.workspaceName || "")}
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
