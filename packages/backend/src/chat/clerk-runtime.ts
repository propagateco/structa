import type { ChatModel } from "@structa/core/conversation";

export type ClerkRunInput = ChatModel.RunInputType & {
	userId: string;
	projectId: string | null;
};

export interface ClerkRuntime {
	startRun(input: ClerkRunInput): Promise<void>;
}

export class ClerkRuntimeUnavailableError extends Error {
	constructor() {
		super(
			"Clerk runtime is not configured: provider execution and durable event writer are unavailable",
		);
		this.name = "ClerkRuntimeUnavailableError";
	}
}

/**
 * Fail closed until the provider worker and credentials are provisioned.
 * Keeping this behind the runtime boundary prevents routes from inventing a
 * provider, key, or fake durable acknowledgement.
 */
export const clerkRuntime: ClerkRuntime = {
	async startRun() {
		throw new ClerkRuntimeUnavailableError();
	},
};
