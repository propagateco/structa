import { Link } from '@tanstack/react-router';
import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
	title,
	items,
	currentPathname,
}: {
	title?: string;
	items: {
		title: string;
		url: string;
		parent: string;
		icon: LucideIcon;
	}[];
	currentPathname: string;
}) {
	return (
		<SidebarGroup>
			{title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								isActive={currentPathname.split('/')[1] === item.parent}
							>
								<Link to={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
