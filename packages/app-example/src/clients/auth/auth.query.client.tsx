import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export async function login(provider?: "google" | "code" | "apple") {
	try {
		// Fetch the authorization URL from your API
		const res = await api.auth.authorize.$get({
			query: {
				provider,
			},
		});

		if (res.ok) {
			// Redirect the user to the authorization URL
			const data = await res.json();
			window.location.href = data.url;
		} else {
			console.error("Failed to get authorization URL:", res.statusText);
		}
	} catch (error) {
		console.error("Error during login:", error);
	}
}

export async function logout() {
	const res = await api.auth.logout.$get();
	if (res.ok) {
		window.location.href = "/signed-out";
	}
	throw new Error("Failed to log out: " + res.statusText);
}

export async function auth() {
	const res = await api.auth.$get();
	if (!res.ok) {
		window.location.href = "/signed-out";
	}
	return await res.json();
}

export const authQueryOptions = queryOptions({
	queryKey: ["auth"],
	queryFn: () => auth(),
	staleTime: Infinity,
});
