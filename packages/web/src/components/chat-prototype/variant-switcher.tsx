"use client";

import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
	CHAT_VARIANTS,
	type PrototypeVariant,
	VARIANT_LABELS,
} from "./variants";

/**
 * Floating switcher for the prototype — bottom-left pill with one button per
 * layout variant + 1/2/3 keyboard shortcuts. Throwaway chrome: never linked
 * from the product nav, removed when the prototype lands.
 */
export function VariantSwitcher({ variant }: { variant: PrototypeVariant }) {
	const navigate = useNavigate();

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const index = Number(event.key);
			if (!Number.isInteger(index) || index < 1 || index > CHAT_VARIANTS.length)
				return;
			const next = CHAT_VARIANTS[index - 1];
			if (next === variant) return;
			void navigate({
				to: "/app/prototype-chat",
				search: { variant: next },
			});
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate, variant]);

	return (
		<fieldset
			aria-label="Prototype layout variant"
			className="fixed bottom-4 left-4 z-50 flex items-center gap-0.5 rounded-full border bg-background/95 p-1 shadow-lg backdrop-blur"
		>
			<span className="text-muted-foreground px-2 text-xs">
				Prototype · layout
			</span>
			{CHAT_VARIANTS.map((name, index) => (
				<Link
					key={name}
					to="/app/prototype-chat"
					search={{ variant: name }}
					title={`${VARIANT_LABELS[name]} (press ${index + 1})`}
					className={cn(
						"flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs transition-colors",
						variant === name
							? "bg-primary text-primary-foreground"
							: "text-muted-foreground hover:bg-muted hover:text-foreground",
					)}
				>
					<span className="opacity-60 tabular-nums">{index + 1}</span>
					{VARIANT_LABELS[name]}
				</Link>
			))}
		</fieldset>
	);
}
