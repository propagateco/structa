"use client";

import { Layers, Sparkles } from "lucide-react";
import * as React from "react";

export type Project = {
    id: string;
    name: string;
    logo?: React.ElementType;
};

export const staticProjects: Project[] = [
    { id: "Bathroom", name: "Bathroom", logo: Sparkles },
    { id: "Kitchen", name: "Kitchen" },
    { id: "Guest Room", name: "Guest Room", logo: Layers },
];

type ProjectSwitcherContextValue = {
    projects: Project[];
    activeProject: Project | undefined;
    setActiveProject: (project: Project | undefined) => void;
};

const ProjectSwitcherContext =
    React.createContext<ProjectSwitcherContextValue | null>(null);

export function ProjectSwitcherProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeProject, setActiveProject] = React.useState<
        Project | undefined
    >(staticProjects[0]);

    const value = React.useMemo(
        () => ({
            projects: staticProjects,
            activeProject,
            setActiveProject,
        }),
        [activeProject],
    );

    return (
        <ProjectSwitcherContext.Provider value={value}>
            {children}
        </ProjectSwitcherContext.Provider>
    );
}

export function useProjectSwitcher() {
    const context = React.useContext(ProjectSwitcherContext);

    if (!context) {
        throw new Error(
            "useProjectSwitcher must be used within a ProjectSwitcherProvider",
        );
    }

    return context;
}
