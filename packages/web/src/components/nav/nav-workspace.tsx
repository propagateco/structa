// TODO: STUB - Replace with actual BrandingModel from @core when available
// Currently using stub types until branding model is implemented

export type BrandingModelStub = {
	icon?: string | null;
	publishedAt?: string | null;
	updatedAt: string;
};

// TODO: STUB - Replace with actual UserModel from @core when available
// Currently using stub types until user model is implemented

export type UserModelStub = {
	id: string;
	name: string;
	email: string;
	image?: string | null;
	workspaceName: string;
	plan?: string;
};

// TODO: Replace with actual Jotai atoms when branding state is implemented
// Currently using mock data until Jotai state management is set up

export const MOCK_BRANDING_CHANGES = {
	icon: null as string | null,
};

import { Link } from "@tanstack/react-router";
import { formatWorkspaceName } from "@/lib/string-utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getImageUrl } from "../ui/image";
import { SidebarMenuButton } from "../ui/sidebar";

export function NavWorkspace({
	user,
	branding,
}: {
	user: UserModelStub;
	branding: BrandingModelStub;
}) {
	// TODO: Replace with actual Jotai atom when branding state is implemented
	// Use direct Jotai atoms for live preview data
	const changes = MOCK_BRANDING_CHANGES;

	// Implement three-state icon handling (following iphone.tsx pattern)
	// TODO: Replace with actual File checking when Jotai state is implemented
	const iconUrl = (() => {
		// STUB: Always return the branding icon for now
		// When Jotai state is implemented, this will check for File objects
		return branding.icon;
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
