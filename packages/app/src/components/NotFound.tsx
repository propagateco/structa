import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NotFoundScreen({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "flex min-h-screen items-center justify-center bg-background",
                className
            )}
        >
            <div className="flex flex-col items-center">
                <img
                    src="/logo/outline/logo-light-sm.svg"
                    alt="Structa"
                    className="opacity-60 w-auto h-8 dark:invert mb-5"
                />
                <p className="text-md font-medium text-muted-foreground max-w-sm text-center mb-8">
                    The page you are lookig for does not exist.
                </p>
                <div className="flex flex-row items-center gap-3">
                    <Button size="sm" onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                    <Link to="/">
                        <Button variant="outline" size="sm">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
