export interface Location {
	city: string;
	country: string;
}

/**
 * Extracts the real IP address from request headers
 * Handles proxy chains and various header formats
 */
export function extractIPAddress(headers: Headers): string {
	// Try x-forwarded-for first (common in proxies/load balancers)
	const forwardedFor = headers.get("x-forwarded-for");
	if (forwardedFor) {
		// Take the first IP in the chain (client IP)
		console.log(`x-forwarded-for header: ${forwardedFor}`);
		return forwardedFor.split(",")[0].trim();
	}

	// Try x-real-ip header
	const realIp = headers.get("x-real-ip");
	if (realIp) {
		console.log(`x-real-ip header: ${realIp}`);
		return realIp.trim();
	}

	// Fallback
	return "unknown";
}

/**
 * Checks if an IP address is private/local
 */
function isPrivateIP(ip: string): boolean {
	if (ip === "unknown" || ip === "127.0.0.1" || ip === "localhost") {
		return true;
	}

	// Private IP ranges
	const privateRanges = [
		/^10\./,
		/^172\.(1[6-9]|2\d|3[01])\./,
		/^192\.168\./,
		/^::1$/,
		/^fc00:/,
	];

	return privateRanges.some((range) => range.test(ip));
}

/**
 * Fetches geolocation data from ip-api.com
 * Returns null if lookup fails or IP is private
 */
export async function getLocationFromIP(ip: string): Promise<Location | null> {
	// Don't lookup private IPs
	if (isPrivateIP(ip)) {
		console.log(`Skipping geolocation for private IP: ${ip}`);
		return null;
	}

	try {
		// ip-api.com free tier: 45 req/minute, no API key needed
		// Fields parameter limits response size
		const response = await fetch(
			`http://ip-api.com/json/${ip}?fields=status,message,city,country`,
			{
				signal: AbortSignal.timeout(3000), // 3 second timeout
			},
		);

		if (!response.ok) {
			console.error(`Geolocation API error: ${response.status}`);
			return null;
		}

		const data = await response.json();

		if (data.status === "fail") {
			console.error(`Geolocation lookup failed: ${data.message}`);
			return null;
		}

		if (data.status === "success" && data.city && data.country) {
			return {
				city: data.city,
				country: data.country,
			};
		}

		return null;
	} catch (error) {
		console.error("Geolocation lookup error:", error);
		return null;
	}
}
