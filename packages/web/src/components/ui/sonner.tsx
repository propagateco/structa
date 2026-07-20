import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/components/theme-provider";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Styled Sonner toaster using the design-system status colors.
 *
 * Only render toasts when there's a clear need (errors, warnings) — success
 * states are surfaced inline via the MutationDot in the header instead.
 */
const Toaster = ({ ...props }: ToasterProps) => {
	const { resolvedTheme } = useTheme();

	return (
		<Sonner
			theme={resolvedTheme}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group text-base! rounded-xl! p-10 min-h-16 min-w-[420px] border-none! font-sans font-semibold toast shadow-menu! flex items-center gap-3 rounded-xl",
					actionButton:
						"group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
					cancelButton:
						"group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground",
					description: "group-[.toaster]:text-muted-foreground",
					success: "bg-success-toast! text-success-toast-foreground!",
					info: "bg-info-toast! text-info-toast-foreground!",
					warning: "bg-warning-toast! text-warning-toast-foreground!",
					error: "bg-error-toast! text-error-toast-foreground!",
					closeButton:
						"absolute! top-1/2! -translate-y-1/2! right-4! left-auto! transform-none! bg-gray-800/0! hover:bg-gray-800/10! border-none! h-9! w-9! rounded-md! text-inherit! [&>svg]:size-5",
				},
				closeButton: true,
			}}
			icons={{
				success: null,
				error: null,
				warning: null,
				info: null,
			}}
			{...props}
		/>
	);
};

export { Toaster };
