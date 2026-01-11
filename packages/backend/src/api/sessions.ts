import { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { Resource } from 'sst';

export function getSession(c: Context) {
	const access = getCookie(c, 'access_token');
	const refresh = getCookie(c, 'refresh_token');
	return { access, refresh };
}

export function setSession(c: Context, accessToken?: string, refreshToken?: string) {
	if (accessToken) {
		setCookie(c, 'access_token', accessToken, {
			httpOnly: true,
			sameSite: 'None',
			path: '/',
			maxAge: 34560000,
			secure: true,
		});
	}
	if (refreshToken) {
		setCookie(c, 'refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			path: '/',
			maxAge: 34560000,
			secure: true,
		});
	}
}

export function deleteSession(c: Context) {
	deleteCookie(c, 'access_token', {
		httpOnly: true,
		sameSite: 'None',
		path: '/',
		secure: true,
	});
	deleteCookie(c, 'refresh_token', {
		httpOnly: true,
		sameSite: 'None',
		path: '/',
		secure: true,
	});
}
