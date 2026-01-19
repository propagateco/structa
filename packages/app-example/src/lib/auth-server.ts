import { createServerFn } from "@tanstack/react-start";
import { authMiddleware, loginMiddleware } from "@/middleware/auth";

export const getAuth = createServerFn()
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        return context;
    });

export const getLoginAuth = createServerFn()
    .middleware([loginMiddleware])
    .handler(async ({ context }) => {
        return context;
    });
