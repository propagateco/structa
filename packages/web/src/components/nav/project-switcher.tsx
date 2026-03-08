'use client';

import { Link, useNavigate } from '@tanstack/react-router';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuItem,
    DropdownMenuTrigger,
    FilterableDropdownMenu,
} from '@/components/ui/dropdown-menu';
import { Kbd, KbdWrapper } from '@/components/ui/kbd';
import { NavigationSeparator } from '@/components/ui/navigation-separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useKeySequenceShortcut } from '@/hooks/use-key-sequence-shortcut';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProjectSwitcher } from '@/hooks/use-project-switcher';

export function ProjectSwitcher() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { activeProject, projects, setActiveProject } = useProjectSwitcher();
    const [query, setQuery] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    const trigger = activeProject ? (
        <div className="flex items-center gap-2 text-sm">
            <Button
                variant="ghost"
                className="rounded-md px-0 ml-4 hover:bg-transparent dark:hover:bg-transparent hover:text-foreground"
            >
                <Link to="/app" className="max-w-32 truncate text-sm">
                    {activeProject.name}
                </Link>
            </Button>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md text-sidebar-foreground"
                >
                    <ChevronsUpDown className="ml-0 size-4" />
                </Button>
            </DropdownMenuTrigger>
        </div>
    ) : (
        <DropdownMenuTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className="rounded-md text-sidebar-foreground"
            >
                <span className="max-w-32 truncate">All projects</span>
                <ChevronsUpDown className="ml-1 size-4 opacity-70" />
            </Button>
        </DropdownMenuTrigger>
    );

    useKeySequenceShortcut(
        {
            sequence: ['c', 'p'],
            timeoutMs: 700,
            allowInInputs: false,
        },
        () => {
            setOpen(true);
        }
    );

    return (
        <div className="group flex items-center gap-0.5">
            <FilterableDropdownMenu
                open={open}
                onOpenChange={setOpen}
                trigger={
                    <Tooltip>
                        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                        <TooltipContent>
                            Change project
                            <KbdWrapper>
                                <Kbd>C</Kbd>
                                then
                                <Kbd>P</Kbd>
                            </KbdWrapper>
                        </TooltipContent>
                    </Tooltip>
                }
                items={projects}
                itemToLabel={project => project.name}
                query={query}
                onQueryChange={setQuery}
                onSelectItem={project => {
                    setActiveProject(project);
                    setOpen(false);
                }}
                selectedItem={activeProject}
                emptyState={
                    <div className="px-3 py-3 text-sm text-muted-foreground">
                        No projects found
                    </div>
                }
                footer={
                    <DropdownMenuItem
                        onSelect={() => navigate({ to: '/app' })}
                        className="gap-2"
                    >
                        <Plus className="size-4" />
                        Create Project
                    </DropdownMenuItem>
                }
                contentProps={{
                    align: 'start',
                    side: isMobile ? 'bottom' : 'bottom',
                    sideOffset: 8,
                    onCloseAutoFocus: event => event.preventDefault(),
                }}
                className="w-72 rounded-xl border border-border border-b bg-popover p-0 shadow-sm pb-2"
                inputProps={{
                    onFocus: () => setIsInputFocused(true),
                    onBlur: () => setIsInputFocused(false),
                    placeholder: 'Find Project...',
                }}
                inputAddon={
                    isInputFocused ? (
                        <Kbd>Esc</Kbd>
                    ) : (
                        <KbdWrapper>
                            <Kbd>C</Kbd>
                            then
                            <Kbd>P</Kbd>
                        </KbdWrapper>
                    )
                }
                renderItem={(project, { isSelected }) => (
                    <>
                        <span>{project.name}</span>
                        {isSelected ? (
                            <div className="relative ml-auto flex h-6 w-6 items-center justify-center">
                                <Check className="absolute size-4 text-muted-foreground opacity-100 transition-opacity group-data-[highlighted]:opacity-0" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute h-6 w-6 p-0 opacity-0 transition-opacity group-data-[highlighted]:opacity-100"
                                    onClick={event => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        setActiveProject(undefined);
                                        setOpen(false);
                                    }}
                                    aria-label="Clear selected project"
                                >
                                    <X className="size-3" />
                                </Button>
                            </div>
                        ) : null}
                    </>
                )}
            />
            {activeProject ? (
                <>
                    <NavigationSeparator
                        className="mx-1 opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100"
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
