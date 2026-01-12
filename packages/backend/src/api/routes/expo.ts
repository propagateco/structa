import { Hono } from "hono";
import { ExpoController, ExpoModel } from "@structa/core/expo";
import { BuildQueueService } from "@structa/core/build-queue";
import { zValidator } from "@hono/zod-validator";
import { authenticatedMiddleware } from "../middleware";
import { z } from "zod";

/**
 * Expo API Routes
 * ---------------
 *
 * REST endpoints for Expo project management and mobile app deployments.
 * Handles project creation, retrieval, and deletion.
 */

export const ExpoRoute = new Hono()
    .use(authenticatedMiddleware)
    .post("/build/create", async (c) => {
        const userId = c.var.user.id;

        try {
            const result = await BuildQueueService.sendTestBuild(userId);

            return c.json(
                {
                    success: true,
                    message: "Started building app",
                    messageId: result.messageId,
                },
                200
            );
        } catch (error) {
            console.error("Test build queue error:", error);
            return c.json(
                {
                    error: "Failed to queue test build",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    })
    .post(
        "/project/create",
        zValidator("json", ExpoModel.CreateProject),
        async (c) => {
            const userId = c.var.user.id;
            const projectData = c.req.valid("json");

            try {
                const project = await ExpoController.createProject({
                    userId,
                    ...projectData,
                });

                return c.json(
                    {
                        success: true,
                        project,
                        projectName: project.appName,
                        projectSlug: project.slug,
                    },
                    201
                );
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("already exists")) {
                        return c.json(
                            {
                                error: "Project already exists",
                                message: error.message,
                            },
                            409
                        );
                    }
                    if (error.message.includes("valid characters")) {
                        return c.json(
                            {
                                error: "Invalid app name",
                                message: error.message,
                            },
                            400
                        );
                    }
                }
                return c.json(
                    {
                        error: "Failed to create Expo project",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    },
                    500
                );
            }
        }
    )
    .get(
        "/project/:appId",
        zValidator("param", z.object({ appId: z.string() })),
        async (c) => {
            const userId = c.var.user.id;
            const { appId } = c.req.param();

            try {
                const project = await ExpoController.getProjectByAppId({
                    appId,
                    userId,
                });

                return c.json({ project });
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("not found")) {
                        return c.json(
                            {
                                error: "Project not found",
                                message: error.message,
                            },
                            404
                        );
                    }

                    if (error.message.includes("Access denied")) {
                        return c.json(
                            {
                                error: "Access denied",
                                message: error.message,
                            },
                            403
                        );
                    }
                }

                return c.json(
                    {
                        error: "Failed to fetch project",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    },
                    500
                );
            }
        }
    )
    .get("/projects", async (c) => {
        const userId = c.var.user.id;

        try {
            const projects = await ExpoController.getUserProjects(userId);
            return c.json({ projects });
        } catch (error) {
            return c.json(
                {
                    error: "Failed to fetch projects",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    })
    .delete(
        "/project/:appId",
        zValidator("param", z.object({ appId: z.string() })),
        async (c) => {
            const userId = c.var.user.id;
            const { appId } = c.req.param();

            try {
                const result = await ExpoController.deleteProject({
                    appId,
                    userId,
                });

                return c.json(result);
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message.includes("not found")) {
                        return c.json(
                            {
                                error: "Project not found",
                                message: error.message,
                            },
                            404
                        );
                    }

                    if (error.message.includes("Access denied")) {
                        return c.json(
                            {
                                error: "Access denied",
                                message: error.message,
                            },
                            403
                        );
                    }
                }

                return c.json(
                    {
                        error: "Failed to delete project",
                        message:
                            error instanceof Error
                                ? error.message
                                : "Unknown error",
                    },
                    500
                );
            }
        }
    );
