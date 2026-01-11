import { Hono } from "hono";
import { Resource } from "sst";
import { task } from "sst/aws/task";
import { StorageService } from "@structa/core/storage";

export const TestRoute = new Hono()
    .delete("/delete", async (c) => {
        const key =
            "users/user-bz6hfbfr5rb8ogbp1abh1bka/images/image-p1t0gvr4kxxm8qikvgnu3wml";
        const bucket = Resource.Storage.name;

        const response = await StorageService.deleteFile(bucket, key);

        return c.json({ message: "File deleted successfully" }, 200);
    })
    .post("/task", async (c) => {
        console.log("Triggering BuildTask...");

        try {
            // Run the task using the SST task.run() method
            const ret = await task.run(Resource.BuildTask);

            console.log("BuildTask triggered successfully:", ret);

            return c.json(
                {
                    success: true,
                    message: "BuildTask triggered successfully",
                    taskInfo: ret,
                },
                200
            );
        } catch (error) {
            console.error("Failed to trigger BuildTask task:", error);

            return c.json(
                {
                    success: false,
                    error: "Failed to trigger BuildTask",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error",
                },
                500
            );
        }
    });
