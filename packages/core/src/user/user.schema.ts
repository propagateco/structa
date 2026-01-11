import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { id, workspaceID } from '../utils/sql';

const roles = ['admin', 'user', 'subscriber'] as const;
type Role = (typeof roles)[number];
const roleEnum = pgEnum('role', roles);

export const user = pgTable('user', {
	id: id.id,
	workspaceId: workspaceID.workspaceID,
	email: text('email').notNull().unique(),
	role: text('role').default('admin'),
	name: text('name').notNull(),
	workspaceName: text('workspace_name').notNull(),
	image: text('image'),
	workspaceAvatar: text('workspace_avatar'),
	plan: text('plan').notNull(),
	product: text('product').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	deletedAt: timestamp('deleted_at'),
});

// export const userToWorkspace = foreignKey({
// 	columns: [user.workspaceID],
// 	references: [workspace.id],
// });
