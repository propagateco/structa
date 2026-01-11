export * as AppService from "./app.service";

import { app } from "./app.sql";
import { AppModel } from "./app.model";
import { zod } from "../utils/zod";
import { db } from "../drizzle";
import { eq } from "drizzle-orm";

export const create = zod(
  AppModel.App.pick({ id: true, userId: true, name: true }).extend({
    description: AppModel.App.shape.description.optional(),
  }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .insert(app)
        .values({
          id: input.id!,
          userId: input.userId!,
          name: input.name!,
          description: input.description ||
            "A great app description highlights the features and functionality of your app. The ideal description is a concise, informative paragraph followed by a short list of main features.",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .execute();
      return result[0];
    });
  },
);

export const fromID = zod(AppModel.Schema.shape.id, async (id) => {
  const result = await db.transaction(async (tx) => {
    const result = await tx.select().from(app).where(eq(app.id, id)).execute();
    return result[0];
  });

  if (!result) {
    throw new Error("App not found");
  }

  return result;
});

export const getPublishedApp = zod(AppModel.Schema.shape.id, async (id) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select({
        id: app.id,
        userId: app.userId,
        name: app.publishedName,
        description: app.publishedDescription,
        publishedAt: app.publishedAt,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        deletedAt: app.deletedAt,
      })
      .from(app)
      .where(eq(app.id, id))
      .execute();
    return result[0];
  });
});

export const updateNameAndDescriptionFromId = zod(
  AppModel.App.pick({ id: true, name: true, description: true }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(app)
        .set({
          name: input.name,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(app.id, input.id!))
        .returning();
      return result[0];
    });
  },
);

export const updateNameFromId = zod(
  AppModel.App.pick({ id: true, name: true }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(app)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(app.id, input.id!))
        .returning();
      return result[0];
    });
  },
);
export const updateDescriptionFromId = zod(
  AppModel.App.pick({ id: true, description: true }),
  async (input) => {
    return db.transaction(async (tx) => {
      const result = await tx
        .update(app)
        .set({
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(app.id, input.id!))
        .returning();
      return result[0];
    });
  },
);
