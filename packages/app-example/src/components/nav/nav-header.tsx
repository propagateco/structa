import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Sidebar } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  children?: ReactNode;
  className?: string;
}

export function NavigationHeader({
  children,
  className,
}: NavigationHeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full shrink-0 items-center gap-4 border-b px-4 h-10 text-sm font-medium",
        className,
      )}
    >
      <SidebarTrigger>
        <Sidebar />
      </SidebarTrigger>
      {children && (
        <>
          <Separator orientation="vertical" className="h-4" />
          {children}
        </>
      )}
    </header>
  );
}
