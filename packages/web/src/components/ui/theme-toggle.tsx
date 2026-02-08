'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />;
            case 'dark':
                return <Moon className="h-4 w-4" />;
            case 'system':
                return <Monitor className="h-4 w-4" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    aria-label="Toggle theme"
                >
                    {getIcon()}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? 'bg-accent/50' : ''}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? 'bg-accent/50' : ''}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('system')}
                    className={theme === 'system' ? 'bg-accent/50' : ''}
                >
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
