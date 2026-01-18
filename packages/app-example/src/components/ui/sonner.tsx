import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = 'system' } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps['theme']}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: 'group !text-md !rounded-xl p-10 min-h-16 min-w-[420px] !border-none font-sans font-semibold toast !group-[.toaster]:shadow-menu flex items-center gap-3 rounded-xl',
					actionButton:
						'group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground',
					cancelButton:
						'group-[.toaster]:bg-muted group-[.toaster]:text-muted-foreground',
					description: 'group-[.toaster]:text-muted-foreground',
					success:
						'group-[.toaster]:bg-success-toast group-[.toaster]:text-success-toastForeground',
					info: 'group-[.toaster]:bg-info-toast group-[.toaster]:text-info-toastForeground',
					warning:
						'group-[.toaster]:bg-warning-toast group-[.toaster]:text-warning-toastForeground',
					error: 'group-[.toaster]:bg-error-toast group-[.toaster]:text-error-toastForeground',
					closeButton:
						'!absolute !top-1/2 !-translate-y-1/2 !right-4 !left-auto !transform-none !bg-gray-800/0 hover:!bg-gray-800/10 !border-none !h-9 !w-9 !rounded-md !text-inherit [&>svg]:size-5',
				},
				closeButton: true,
				// duration: 10000000,
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
