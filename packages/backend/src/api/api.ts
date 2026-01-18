import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { UserRoute } from './routes/user';
import { AuthRoute } from './routes/auth';
import { StorageRoute } from './routes/storage';

export class VisibleError extends Error {
    constructor(
        public code: string,
        message: string
    ) {
        super(message);
    }
}

const app = new Hono().use(logger()).onError((error, c) => {
    if (error instanceof VisibleError) {
        return c.json(
            {
                code: error.code,
                message: error.message,
            },
            400
        );
    }
    if (error instanceof HTTPException) {
        return c.json(
            {
                message: error.message,
            },
            error.status
        );
    }
    if (error instanceof ZodError) {
        const e = error.errors[0];
        if (e) {
            return c.json(
                {
                    code: e?.code,
                    message: e?.message,
                },
                400
            );
        }
    }
    if (error instanceof Error) {
        return c.json(
            {
                code: error.name,
                message: error.message,
            },
            500
        );
    }
    return c.json(
        {
            code: 'internal',
            message: 'Internal server error',
        },
        500
    );
});

const routes = app
    .route('/auth', AuthRoute)
    .route('/user', UserRoute)
    .route('/storage', StorageRoute);

export const handler = handle(routes);
export type RoutesType = typeof routes;
