import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: `${import.meta.env.VITE_BETTER_AUTH_URL}/auth`,
	plugins: [emailOTPClient()],
	fetchOptions: {
		credentials: "include",
	},
});

export const { signIn, signUp, signOut, getSession } = authClient;
