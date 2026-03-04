import { Sidebar } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

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
                "flex h-10 w-full shrink-0 items-center gap-4 border-b border-border px-4 text-sm font-medium",
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
