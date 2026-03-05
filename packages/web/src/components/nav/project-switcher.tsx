"use client";

import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjectSwitcher } from "@/hooks/use-project-switcher";
import { cn } from "@/lib/utils";

export function ProjectSwitcher() {
	const navigate = useNavigate();
	const isMobile = useIsMobile();
	const { activeProject, projects, setActiveProject } = useProjectSwitcher();
	const [query, setQuery] = React.useState("");

	const filteredProjects = React.useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return projects;
		}
		return projects.filter((project) =>
			project.name.toLowerCase().includes(normalizedQuery),
		);
	}, [projects, query]);

	return (
		<div className="group flex items-center gap-0.5">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="rounded-md">
						<span className="max-w-32 truncate font-medium">
							{activeProject ? activeProject.name : "All projects"}
						</span>
						<ChevronsUpDown className="ml-1 size-4 opacity-70" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-72 rounded-2xl border border-border/70 bg-popover p-2 shadow-lg"
					align="start"
					side={isMobile ? "bottom" : "bottom"}
					sideOffset={8}
				>
					<div className="px-1 pb-2">
						<div className="relative">
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Find Project..."
								className="h-10 rounded-xl border-border/70 bg-background/40 pr-12 text-sm"
								onClick={(event) => event.stopPropagation()}
								onPointerDown={(event) => event.stopPropagation()}
								onKeyDown={(event) => event.stopPropagation()}
							/>
							<div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-border/70 px-2 py-0.5 text-[11px] text-muted-foreground">
								Esc
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-1 px-1">
						{filteredProjects.length ? (
							filteredProjects.map((project) => {
								const ProjectLogo = project.logo;
								const isActive = project.id === activeProject?.id;
								return (
									<DropdownMenuItem
										key={project.id}
										onSelect={() => setActiveProject(project)}
										className={cn(
											"gap-3 rounded-xl px-2 py-2.5",
											isActive && "bg-muted/50 text-foreground",
										)}
									>
										<div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-muted/30 text-muted-foreground">
											{ProjectLogo ? (
												<ProjectLogo className="size-4" />
											) : (
												<div className="size-2 rounded-full bg-muted-foreground/60" />
											)}
										</div>
										<span className="text-sm font-medium text-foreground">
											{project.name}
										</span>
									</DropdownMenuItem>
								);
							})
						) : (
							<div className="px-3 py-3 text-xs text-muted-foreground">
								No projects found
							</div>
						)}
					</div>

					<DropdownMenuSeparator className="my-2" />

					<DropdownMenuItem
						onSelect={() => navigate({ to: "/app" })}
						className="gap-3 rounded-xl px-2 py-2.5 text-muted-foreground hover:text-foreground"
					>
						<div className="flex size-9 items-center justify-center rounded-xl border border-border/70 bg-transparent">
							<Plus className="size-4" />
						</div>
						<span className="text-sm font-medium">Create Project</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{activeProject ? (
				<>
					<span
						className="mx-1 h-6 w-px bg-border opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100"
						aria-hidden="true"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100"
						onClick={() => setActiveProject(undefined)}
						aria-label="Clear project selection"
					>
						<X className="size-4" />
					</Button>
				</>
			) : null}
		</div>
	);
}
