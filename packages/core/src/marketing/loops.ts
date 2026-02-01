import { Resource } from 'sst';

interface LoopsCreateContactParams {
  email: string;
  userId: string; // Our user.id for automatic deduplication
  firstName?: string;
  lastName?: string;
  properties?: {
    [key: string]: string | number | boolean | null;
  };
  mailingLists?: {
    [key: string]: boolean;
  };
}

interface LoopsContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userId?: string; // Returned by Loops for reference
  [key: string]: any; // All other properties
}

interface LoopsError {
  json: {
    error?: string;
    message?: string;
    [key: string]: unknown;
  };
  statusCode: number;
}

/**
 * Create or update contact in Loops
 * userId is used for automatic deduplication
 * If a contact with this userId exists, it's updated
 */
export async function createContactInLoops({
  email,
  userId,
  firstName,
  lastName,
  properties,
  mailingLists,
}: LoopsCreateContactParams): Promise<LoopsContact | null> {
  const apiKey = Resource.LoopsApiKey.value;
  const apiUrl = 'https://app.loops.so/api/v1';

  const body: Record<string, unknown> = {
    email,
    userId, // Pass user.id for automatic deduplication
  };

  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;
  if (properties) body.properties = properties;
  if (mailingLists) body.mailingLists = mailingLists;

  try {
    const response = await fetch(`${apiUrl}/contacts/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error: LoopsError = await response.json();
      console.error('Loops contact creation failed:', error);
      return null;
    }

    const contact: LoopsContact = await response.json();
    return contact;
  } catch (error) {
    console.error('Loops API error:', error);
    return null;
  }
}

/**
 * Send event to trigger emails in Loops (future use)
 */
export async function sendEventInLoops({
  eventName,
  eventProperties,
  email,
  userId,
  mailingLists,
}: {
  eventName: string;
  eventProperties?: {
    [key: string]: string | number | boolean;
  };
  email?: string;
  userId?: string;
  mailingLists?: {
    [key: string]: boolean;
  };
}): Promise<boolean> {
  const apiKey = Resource.LoopsApiKey.value;
  const apiUrl = 'https://app.loops.so/api/v1';

  const body: Record<string, unknown> = {
    eventName,
  };

  if (eventProperties) body.eventProperties = eventProperties;
  if (email) body.email = email;
  if (userId) body.userId = userId;
  if (mailingLists) body.mailingLists = mailingLists;

  try {
    const response = await fetch(`${apiUrl}/events/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.ok;
  } catch (error) {
    console.error('Loops event send error:', error);
    return false;
  }
}
