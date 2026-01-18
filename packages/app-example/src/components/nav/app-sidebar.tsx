import * as React from "react";
import { UserModel } from "@core/user/user.model";
import { BrandingModel } from "@core/branding/branding.model";
import {
  Frame,
  LifeBuoy,
  Wallet,
  Box,
  UsersRound,
  GalleryVerticalEnd,
  MessageCircleQuestion,
  LayoutGrid,
  Globe,
} from "lucide-react";
import { NavMain } from "@/components/nav/nav-main";
import { NavSecondary } from "@/components/nav/nav-secondary";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavWorkspace } from "./nav-workspace";
import { NavProductsWrapper } from "./nav-products-wrapper";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      parent: "",
      icon: LayoutGrid,
    },
    {
      title: "Members",
      url: "/members",
      parent: "members",
      icon: UsersRound,
    },
    {
      title: "Sales",
      url: "/sales/transactions",
      parent: "sales",
      icon: Wallet,
    },
  ],
  navPlatform: [
    {
      title: "Products",
      url: "/products",
      parent: "products",
      icon: Box,
    },
    {
      title: "Design",
      url: "/design/branding",
      parent: "design",
      icon: Frame,
    },
    {
      title: "Media Library",
      url: "/media",
      parent: "media",
      icon: GalleryVerticalEnd,
    },
    {
      title: "Releases",
      url: "/releases/overview",
      parent: "releases",
      icon: Globe,
    },
  ],
  navSecondary: [
    {
      title: "Help Centre",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Contact Us",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentPathname: string;
  user: UserModel.UserType;
  branding: BrandingModel.BrandingQueryType;
}

export function AppSidebar({
  currentPathname,
  user,
  branding,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props} className="group">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between gap-2 shrink-0">
            <NavWorkspace user={user} branding={branding} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} currentPathname={currentPathname} />
        <NavMain
          title="App"
          items={data.navPlatform}
          currentPathname={currentPathname}
        />
        <NavProductsWrapper />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary
          items={data.navSecondary}
          currentPathname={currentPathname}
          className="mt-auto"
        />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
