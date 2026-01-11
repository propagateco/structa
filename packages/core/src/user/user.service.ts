export * as UserService from "./user.service";

import { user } from "../auth/auth.sql";
import { UserModel } from "./user.model";
import { zod } from "../utils/zod";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const initialise = async () => {
    await db.transaction(async (tx) => {
        await tx.select().from(user).limit(1).execute();
    });
    return;
};

// export const create = zod(
//     UserModel.Schema.pick({
//         id: true,
//         workspaceId: true,
//         email: true,
//         role: true,
//         name: true,
//         workspaceName: true,
//         image: true,
//         plan: true,
//         product: true,
//     }).partial({
//         id: true,
//         workspaceId: true,
//         role: true,
//         name: true,
//         workspaceName: true,
//         image: true,
//         plan: true,
//         product: true,
//     }),
//     async (input) => {
//         const id = createId();
//         const workspaceId = input.workspaceId ?? createId();
//         return db.transaction(async (tx) => {
//             const result = await tx
//                 .insert(user)
//                 .values({
//                     id: id,
//                     workspaceId: workspaceId,
//                     email: input.email,
//                     role: input.role ?? "admin",
//                     name: input.name ?? "",
//                     workspaceName: "",
//                     image: input.image ?? null,
//                     workspaceAvatar: null,
//                     plan: "onboarding",
//                     product: "",
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     deletedAt: null,
//                 })
//                 .returning()
//                 .execute();
//             return UserModel.Subject.parse(result[0]);
//         });
//     }
// );

export const returnAll = async () =>
    db.transaction(async (tx) => {
        return tx.select().from(user).execute();
    });

export const fromID = zod(UserModel.Schema.shape.id, async (id) =>
    db.transaction(async (tx) => {
        const result = await tx
            .select()
            .from(user)
            .where(eq(user.id, id))
            .execute();
        return UserModel.User.parse(result[0]);
    })
);

export const fromEmail = zod(UserModel.User.shape.email, async (email) =>
    db.transaction(async (tx) => {
        const result = await tx
            .select({
                id: user.id,
                workspaceId: user.workspaceId,
                email: user.email,
            })
            .from(user)
            .where(eq(user.email, email))
            .execute();

        // This will return when a user is first created
        if (!result[0]) {
            return null;
        }

        return UserModel.Subject.parse(result[0]);
    })
);

export const avatarKeyFromId = zod(UserModel.User.shape.id, async (id) =>
    db.transaction(async (tx) => {
        const result = await tx
            .select()
            .from(user)
            .where(eq(user.id, id))
            .execute();
        const avatarUrl = result[0]?.image ?? null;
        if (!avatarUrl) {
            return null;
        }
        return avatarUrl.split("/").pop();
    })
);

export const updateNameFromId = zod(
    UserModel.User.pick({ id: true, name: true }),
    async (input) =>
        db.transaction(async (tx) => {
            const result = await tx
                .update(user)
                .set({
                    name: input.name,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, input.id))
                .returning()
                .execute();
            return UserModel.User.parse(result[0]);
        })
);

export const updateProfileFromOnboarding = zod(
    UserModel.User.pick({
        id: true,
        name: true,
        workspaceId: true,
        workspaceName: true,
        product: true,
        plan: true,
    }).partial({
        workspaceId: true,
    }),
    async (input) =>
        db.transaction(async (tx) => {
            // Generate a new workspaceId if not provided (user is creating new workspace)
            // If workspaceId is provided, user is joining existing workspace via invitation
            const workspaceId = input.workspaceId ?? createId();
            
            const result = await tx
                .update(user)
                .set({
                    name: input.name,
                    workspaceId: workspaceId,
                    workspaceName: input.workspaceName,
                    product: input.product,
                    plan: input.plan,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, input.id))
                .returning()
                .execute();
            return UserModel.User.parse(result[0]);
        })
);

export const updateProfileNamesFromId = zod(
    UserModel.User.pick({ id: true, name: true, workspaceName: true }),
    async (input) =>
        db.transaction(async (tx) => {
            const result = await tx
                .update(user)
                .set({
                    name: input.name,
                    workspaceName: input.workspaceName,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, input.id))
                .returning()
                .execute();
            return UserModel.User.parse(result[0]);
        })
);

export const updateProfileNamesAndAvatarFromId = zod(
    UserModel.User.pick({
        id: true,
        name: true,
        workspaceName: true,
        image: true,
    }),
    async (input) =>
        db.transaction(async (tx) => {
            const result = await tx
                .update(user)
                .set({
                    name: input.name,
                    workspaceName: input.workspaceName,
                    image: input.image,
                    updatedAt: new Date(),
                })
                .where(eq(user.id, input.id))
                .returning()
                .execute();
            return UserModel.User.parse(result[0]);
        })
);
