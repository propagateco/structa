import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronRight, Circle } from "lucide-react";
import * as React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const dropdownMenuSubTriggerVariants = cva(
	"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-sidebar-accent-foreground",
				destructive:
					"text-destructive hover:bg-destructive/10 active:bg-destructive/10 focus:bg-destructive/10 data-[state=open]:bg-destructive/10 data-[highlighted]:bg-destructive/10",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	} & VariantProps<typeof dropdownMenuSubTriggerVariants>
>(({ className, inset, variant, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={cn(
			dropdownMenuSubTriggerVariants({ variant }),
			inset && "pl-8",
			className,
		)}
		{...props}
	>
		{children}
		<ChevronRight className="ml-auto" />
	</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
	DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		className={cn(
			"z-50 min-w-[8rem] overflow-hidden rounded-lg border-none bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
			className,
		)}
		{...props}
	/>
));
DropdownMenuSubContent.displayName =
	DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				"z-50 border border-border dark:border-none max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-2 text-popover-foreground shadow-sm",
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

type FilterableDropdownMenuProps<T> = {
	trigger: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	items: T[];
	itemToLabel: (item: T) => string;
	filterFn?: (item: T, query: string) => boolean;
	renderItem: (item: T, context: { isSelected: boolean }) => React.ReactNode;
	onSelectItem: (item: T) => void;
	selectedItem?: T | null;
	query: string;
	onQueryChange: (value: string) => void;
	placeholder?: string;
	emptyState?: React.ReactNode;
	footer?: React.ReactNode;
	contentProps?: React.ComponentPropsWithoutRef<
		typeof DropdownMenuPrimitive.Content
	>;
	className?: string;
	inputGroupProps?: React.ComponentPropsWithoutRef<typeof InputGroup>;
	inputProps?: React.ComponentPropsWithoutRef<typeof InputGroupInput>;
	inputAddon?: React.ReactNode;
};

function FilterableDropdownMenu<T>({
	trigger,
	open,
	onOpenChange,
	items,
	itemToLabel,
	filterFn,
	renderItem,
	onSelectItem,
	selectedItem,
	query,
	onQueryChange,
	placeholder,
	emptyState,
	footer,
	contentProps,
	className,
	inputGroupProps,
	inputProps,
	inputAddon,
}: FilterableDropdownMenuProps<T>) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const menuRef = React.useRef<HTMLDivElement>(null);
	const { className: contentClassName, ...restContentProps } =
		contentProps ?? {};
	const { className: inputGroupClassName, ...restInputGroupProps } =
		inputGroupProps ?? {};
	const {
		className: inputClassName,
		onChange: inputOnChange,
		onKeyDown: inputOnKeyDown,
		...restInputProps
	} = inputProps ?? {};

	const focusMenuItem = React.useCallback((direction: "first" | "last") => {
		const itemsToFocus = menuRef.current?.querySelectorAll<HTMLElement>(
			"[role=menuitem]:not([data-disabled=true])",
		);
		if (!itemsToFocus?.length) {
			return;
		}
		const target =
			direction === "first"
				? itemsToFocus[0]
				: itemsToFocus[itemsToFocus.length - 1];
		target?.focus();
	}, []);

	const filteredItems = React.useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return items;
		}
		if (filterFn) {
			return items.filter((item) => filterFn(item, normalizedQuery));
		}
		return items.filter((item) =>
			itemToLabel(item).toLowerCase().includes(normalizedQuery),
		);
	}, [filterFn, itemToLabel, items, query]);

	React.useEffect(() => {
		if (!open) {
			return;
		}
		requestAnimationFrame(() => inputRef.current?.focus());
	}, [open]);

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			focusMenuItem(event.key === "ArrowDown" ? "first" : "last");
			return;
		}
		if (event.key === "Enter" && filteredItems.length === 1) {
			event.preventDefault();
			const [item] = filteredItems;
			if (item) {
				onSelectItem(item);
				onOpenChange(false);
			}
			return;
		}
		inputOnKeyDown?.(event);
		if (!event.defaultPrevented) {
			event.stopPropagation();
		}
	};

	return (
		<DropdownMenu open={open} onOpenChange={onOpenChange}>
			{trigger}
			<DropdownMenuContent
				ref={menuRef}
				className={cn(className, contentClassName)}
				{...restContentProps}
			>
				<div className="pb-2">
					<InputGroup
						className={cn(
							"h-12 rounded-none border-x-0 border-t-0 border-sidebar-border",
							inputGroupClassName,
						)}
						{...restInputGroupProps}
					>
						<InputGroupInput
							ref={inputRef}
							value={query}
							onChange={(event) => {
								inputOnChange?.(event);
								onQueryChange(event.target.value);
							}}
							placeholder={placeholder}
							className={cn("h-12 px-3 text-sm", inputClassName)}
							onClick={(event) => event.stopPropagation()}
							onPointerDown={(event) => event.stopPropagation()}
							onKeyDown={handleInputKeyDown}
							{...restInputProps}
						/>
						{inputAddon ? (
							<InputGroupAddon align="inline-end" className="pr-4 text-xs">
								{inputAddon}
							</InputGroupAddon>
						) : null}
					</InputGroup>
				</div>

				<div className="flex flex-col gap-1 px-2">
					{filteredItems.length
						? filteredItems.map((item, index) => {
								const isSelected = selectedItem ? item === selectedItem : false;
								return (
									<DropdownMenuItem
										key={itemToLabel(item) + index}
										onSelect={() => onSelectItem(item)}
										className="group flex items-center py-2"
									>
										{renderItem(item, { isSelected })}
									</DropdownMenuItem>
								);
							})
						: (emptyState ?? (
								<div className="px-3 py-3 text-sm text-muted-foreground">
									No items found
								</div>
							))}
				</div>

				{footer ? (
					<>
						<DropdownMenuSeparator className="my-2" />
						<div className="flex flex-col px-2">{footer}</div>
					</>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

const dropdownMenuItemVariants = cva(
	"relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary dark:data-[active=true]:bg-primary/5 hover:bg-sidebar-accent hover:text-primary dark:hover:bg-primary/5 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-primary dark:data-[highlighted]:bg-primary/5",
				destructive:
					"text-destructive hover:bg-destructive/10 data-[active=true]:bg-destructive/10 focus:bg-destructive/10 data-[highlighted]:bg-destructive/10",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	} & VariantProps<typeof dropdownMenuItemVariants>
>(({ className, inset, variant, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			dropdownMenuItemVariants({ variant }),
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-sidebar-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
	DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-sidebar-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<Circle className="h-2 w-2 fill-current" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn(
			"px-2 py-1.5 text-sm font-semibold",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-sidebar-border", className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
			{...props}
		/>
	);
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
	FilterableDropdownMenu,
};
