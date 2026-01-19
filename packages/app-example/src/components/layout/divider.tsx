import { cn } from "@/lib/utils";

interface DividerProps {
    text?: string;
    className?: string;
}

export function Divider({ text, className }: DividerProps) {
    return (
        <div
            className={cn(
                "relative w-full",
                text
                    ? "text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                    : "border-t border-border",
                className
            )}
        >
            {text && (
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    {text}
                </span>
            )}
        </div>
    );
}
