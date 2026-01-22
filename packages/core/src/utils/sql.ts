// Helpers for repeated SQL functionality
import { sql } from "drizzle-orm";
import { char, foreignKey, timestamp, uuid } from "drizzle-orm/pg-core";

export { createId } from "@paralleldrive/cuid2";

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

// Define a UUID column
export const cuid = (name: string) => char(name, { length: 24 });

export const id = {
	get id() {
		return cuid("id").primaryKey().notNull();
	},
};

export const workspaceID = {
	get id() {
		return cuid("id").notNull();
	},
	get workspaceID() {
		return cuid("workspace_id").notNull();
	},
};

// export const timestamps = {
//     timeCreated: timestamp("time_created", {
//       mode: "string",
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     timeUpdated: timestamp("time_updated", {
//       mode: "string",
//     })
// 		.notNull()
// 		.default(sql`CURRENT_TIMESTAMP`)
// 		.onUpdateNow(),
// 	timeDeleted: timestamp('time_deleted', {
// 		mode: 'string',
// 	}),
// };
