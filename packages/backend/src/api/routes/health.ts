import { Hono } from 'hono';

export const HealthRoute = new Hono().get('/', async c => {
    return c.json({ message: 'Structa api is healthy' });
});
