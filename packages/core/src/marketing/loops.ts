import { Resource } from 'sst';
import { LoopsClient, APIError, RateLimitExceededError } from 'loops';

/**
 * Loops API error interface for structured error responses
 */
export interface LoopsApiError {
    error?: string;
    message?: string;
    [key: string]: unknown;
}

/**
 * Loops contact interface
 */
export interface LoopsContact {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    userId?: string;
    source?: string;
    subscribed?: boolean;
    userGroup?: string;
    optInStatus?: string | null;
    [key: string]: unknown;
}

/**
 * Result type for Loops API operations
 * Provides structured success/failure information with full error details
 */
export type LoopsResult<T> =
    | { success: true; data: T }
    | { success: false; error: string; details?: LoopsApiError };

/**
 * Log prefix for consistent log formatting
 */
const LOG_PREFIX = '[Loops]';

/**
 * Format timestamp for logs
 */
function timestamp(): string {
    return new Date().toISOString();
}

/**
 * Get a configured Loops client
 */
function getLoopsClient(): LoopsClient {
    const apiKey = Resource.LoopsApiKey.value;
    return new LoopsClient(apiKey);
}

/**
 * Handle Loops API errors and convert to LoopsResult
 */
function handleLoopsError(error: unknown, operation: string): LoopsResult<never> {
    if (error instanceof RateLimitExceededError) {
        const message = `Rate limit exceeded (${error.limit} per second)`;
        console.error(`${LOG_PREFIX} ${timestamp()} RATE LIMITED: ${message}`);
        return {
            success: false,
            error: message,
        };
    }

    if (error instanceof APIError) {
        const errorDetails: LoopsApiError = (error.json as LoopsApiError) || {
            message: `HTTP ${error.statusCode}`,
            rawBody: error.rawBody,
        };
        const errorMessage = errorDetails.message || errorDetails.error || `Loops API returned ${error.statusCode}`;

        console.error(`${LOG_PREFIX} ${timestamp()} FAILED: ${errorMessage}`);
        console.error(`${LOG_PREFIX} ${timestamp()} Error details:`, JSON.stringify(errorDetails, null, 2));

        return {
            success: false,
            error: errorMessage,
            details: errorDetails,
        };
    }

    // Non-API errors (network, etc.)
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`${LOG_PREFIX} ${timestamp()} EXCEPTION: ${errorMessage}`);

    return {
        success: false,
        error: `Loops API exception: ${errorMessage}`,
    };
}

/**
 * Create or update contact in Loops
 * Uses updateContact which creates if not exists, updates if exists
 * userId is used for automatic deduplication
 *
 * @returns LoopsResult with success/failure and full error details
 */
export async function createContactInLoops({
    email,
    userId,
    firstName,
    lastName,
    properties,
    mailingLists,
}: {
    email: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    properties?: {
        [key: string]: string | number | boolean | null;
    };
    mailingLists?: {
        [key: string]: boolean;
    };
}): Promise<LoopsResult<LoopsContact>> {
    console.log(
        `${LOG_PREFIX} ${timestamp()} Creating/updating contact for email=${email}, userId=${userId}`
    );

    try {
        const loops = getLoopsClient();

        // Build contact properties
        const contactProperties: Record<string, string | number | boolean | null> = {
            ...properties,
        };
        if (firstName) contactProperties.firstName = firstName;
        if (lastName) contactProperties.lastName = lastName;

        // Use updateContact which creates OR updates based on userId
        // This handles deduplication automatically
        const response = await loops.updateContact({
            email,
            userId,
            properties: contactProperties,
            mailingLists,
        });

        if (response.success && response.id) {
            console.log(
                `${LOG_PREFIX} ${timestamp()} SUCCESS: Contact created/updated with id=${response.id}`
            );

            return {
                success: true,
                data: {
                    id: response.id,
                    email,
                    userId,
                    firstName,
                    lastName,
                },
            };
        }

        // Unexpected response
        console.error(`${LOG_PREFIX} ${timestamp()} UNEXPECTED RESPONSE:`, response);
        return {
            success: false,
            error: 'Unexpected response from Loops API',
        };
    } catch (error) {
        return handleLoopsError(error, 'createContact');
    }
}

/**
 * Send event to trigger emails in Loops
 *
 * @returns LoopsResult with success/failure
 */
export async function sendEventInLoops({
    eventName,
    eventProperties,
    contactProperties,
    email,
    userId,
    mailingLists,
}: {
    eventName: string;
    eventProperties?: {
        [key: string]: string | number | boolean;
    };
    contactProperties?: {
        [key: string]: string | number | boolean | null;
    };
    email?: string;
    userId?: string;
    mailingLists?: {
        [key: string]: boolean;
    };
}): Promise<LoopsResult<{ success: boolean }>> {
    console.log(
        `${LOG_PREFIX} ${timestamp()} Sending event: ${eventName} for email=${email}, userId=${userId}`
    );

    try {
        const loops = getLoopsClient();

        const response = await loops.sendEvent({
            eventName,
            email,
            userId,
            eventProperties,
            contactProperties,
            mailingLists,
        });

        if (response.success) {
            console.log(`${LOG_PREFIX} ${timestamp()} SUCCESS: Event ${eventName} sent`);
            return { success: true, data: { success: true } };
        }

        console.error(`${LOG_PREFIX} ${timestamp()} UNEXPECTED RESPONSE:`, response);
        return {
            success: false,
            error: 'Unexpected response from Loops API',
        };
    } catch (error) {
        return handleLoopsError(error, 'sendEvent');
    }
}

/**
 * Test that the Loops API key is valid
 */
export async function testLoopsApiKey(): Promise<LoopsResult<{ teamName: string }>> {
    console.log(`${LOG_PREFIX} ${timestamp()} Testing API key...`);

    try {
        const loops = getLoopsClient();
        const response = await loops.testApiKey();

        if (response.success && response.teamName) {
            console.log(`${LOG_PREFIX} ${timestamp()} SUCCESS: API key valid for team "${response.teamName}"`);
            return { success: true, data: { teamName: response.teamName } };
        }

        return {
            success: false,
            error: 'Invalid API key response',
        };
    } catch (error) {
        return handleLoopsError(error, 'testApiKey');
    }
}

/**
 * Find a contact by email or userId
 */
export async function findContactInLoops({
    email,
    userId,
}: {
    email?: string;
    userId?: string;
}): Promise<LoopsResult<LoopsContact | null>> {
    console.log(`${LOG_PREFIX} ${timestamp()} Finding contact: email=${email}, userId=${userId}`);

    try {
        const loops = getLoopsClient();
        const response = await loops.findContact({ email, userId });

        if (response && response.length > 0) {
            console.log(`${LOG_PREFIX} ${timestamp()} SUCCESS: Found contact with id=${response[0].id}`);
            return { success: true, data: response[0] as LoopsContact };
        }

        console.log(`${LOG_PREFIX} ${timestamp()} SUCCESS: No contact found`);
        return { success: true, data: null };
    } catch (error) {
        return handleLoopsError(error, 'findContact');
    }
}

// Re-export the error types for consumers
export { APIError, RateLimitExceededError };
