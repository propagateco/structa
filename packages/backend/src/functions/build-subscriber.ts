import { SQSEvent } from "aws-lambda";
import { Resource } from "sst";
import { task } from "sst/aws/task";

/**
 * Lambda function to trigger Fargate tasks when SQS messages arrive
 *
 * This function is triggered by SQS messages in the build queue.
 * For each message, it starts a new Fargate task to process the build.
 */

export const handler = async (event: SQSEvent) => {
    console.log(`Processing ${event.Records.length} messages from build queue`);

    const results = [];

    for (const record of event.Records) {
        try {
            console.log("Processing message:", record.messageId);
            console.log("Message body:", record.body);

            // Parse the build message to validate it
            const buildMessage = JSON.parse(record.body);

            // Validate required fields
            if (!buildMessage.userId || !buildMessage.buildType) {
                throw new Error(
                    "Invalid message format: missing userId or buildType"
                );
            }

            // Run the SST Task using the SDK
            const runResult = await task.run(Resource.BuildTask, {
                // Pass the original message as environment variable for the worker
                BUILD_MESSAGE: record.body,
                MESSAGE_ID: record.messageId,
                USER_ID: buildMessage.userId,
                BUILD_TYPE: buildMessage.buildType,
            });

            console.log("Task started successfully:", runResult.arn);

            results.push({
                messageId: record.messageId,
                taskArn: runResult.arn,
                status: "started",
            });
        } catch (error) {
            console.error(
                "Failed to process message:",
                record.messageId,
                error
            );

            results.push({
                messageId: record.messageId,
                status: "failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });

            // Throw error to trigger SQS retry mechanism
            throw error;
        }
    }

    return {
        statusCode: 200,
        processedMessages: event.Records.length,
        results,
    };
};

