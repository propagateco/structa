/**
 * Build Queue Service
 *
 * Handles sending build requests to SQS queue for Fargate processing.
 * This service abstracts the queue operations from the API layer.
 */

import { Resource } from "sst";

export interface BuildQueueMessage {
    userId: string;
    appId?: string;
    buildType: "test" | "expo-build";
    timestamp: string;
    metadata?: Record<string, any>;
}

export class BuildQueueService {
    /**
     * Sends a test build message to the queue
     */
    static async sendTestBuild(
        userId: string
    ): Promise<{ messageId: string; success: boolean }> {
        const message: BuildQueueMessage = {
            userId,
            buildType: "test",
            timestamp: new Date().toISOString(),
            metadata: {
                description:
                    "Test build to verify Fargate + Queue architecture",
            },
        };

        return this.sendMessage(message);
    }

    /**
     * Sends an Expo build message to the queue
     */
    static async sendExpoBuild(
        userId: string,
        appId: string,
        buildConfig: Record<string, any>
    ): Promise<{ messageId: string; success: boolean }> {
        const message: BuildQueueMessage = {
            userId,
            appId,
            buildType: "expo-build",
            timestamp: new Date().toISOString(),
            metadata: {
                buildConfig,
                description: "Expo build request",
            },
        };

        return this.sendMessage(message);
    }

    /**
     * Generic method to send any message to the build queue
     */
    private static async sendMessage(
        message: BuildQueueMessage
    ): Promise<{ messageId: string; success: boolean }> {
        try {
            // Import SQS client from aws-sdk v3 for better tree-shaking
            const { SQSClient, SendMessageCommand } = await import(
                "@aws-sdk/client-sqs"
            );

            const client = new SQSClient({});

            // Get queue URL from environment variable set by SST
            const queueUrl = Resource.BuildQueue.url;
            if (!queueUrl) {
                throw new Error(
                    "Build queue URL not found. Deploy infrastructure first."
                );
            }

            const command = new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify(message),
                MessageAttributes: {
                    userId: {
                        DataType: "String",
                        StringValue: message.userId,
                    },
                    buildType: {
                        DataType: "String",
                        StringValue: message.buildType,
                    },
                },
            });

            const result = await client.send(command);

            if (!result.MessageId) {
                throw new Error("No message ID returned from SQS");
            }

            return {
                messageId: result.MessageId,
                success: true,
            };
        } catch (error) {
            console.error("Failed to send message to build queue:", error);
            throw new Error(
                `Build queue error: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        }
    }
}
