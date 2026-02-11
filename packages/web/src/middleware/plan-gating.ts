import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { auth } from '@/lib/auth';

/**
 * Middleware to protect /app routes
 * Redirects plan=null users to /onboarding
 * Allows plan='pro' or any other plan value to access /app
 */
export const appAccessMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw redirect({
        to: '/login' as any,
      });
    }

    // Redirect plan=null users to /onboarding (no /app access)
    if (!session.user.plan) {
      throw redirect({
        to: '/onboarding' as any,
      });
    }

    // Allow pro users and any user with a plan to access /app
    return await next({
      context: { session: session.session, user: session.user },
    });
  }
);
