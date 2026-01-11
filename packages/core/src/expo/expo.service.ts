export * as ExpoService from './expo.service';

import { db } from '../drizzle';
import { Expo } from './expo.sql';
import * as ExpoModel from './expo.model';
import { eq, and, isNull, count } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/**
 * Expo Data Access Layer
 * ----------------------
 *
 * Low-level database operations for Expo project management.
 * Handles CRUD operations and data validation.
 */

export async function createProject(data: {
	appId: string;
	appName: string;
	slug: string;
	userId: string;
	status?: 'creating' | 'ready' | 'active' | 'inactive' | 'failed';
}) {
	const validated = ExpoModel.Insert.parse({
		id: createId(),
		appId: data.appId,
		appName: data.appName,
		slug: data.slug,
		userId: data.userId,
		status: data.status || 'creating',
	});

	const result = await db
		.insert(Expo)
		.values(validated)
		.returning()
		.execute();

	const project = result[0];
	if (!project) {
		throw new Error('Failed to create Expo project');
	}

	return ExpoModel.Query.parse(project);
}

export async function findProjectByAppId(appId: string) {
	const result = await db
		.select()
		.from(Expo)
		.where(and(
			eq(Expo.appId, appId),
			isNull(Expo.deletedAt)
		))
		.limit(1)
		.execute();

	const project = result[0];
	return project ? ExpoModel.Query.parse(project) : null;
}

export async function findProjectsByUserId(userId: string) {
	const result = await db
		.select()
		.from(Expo)
		.where(and(
			eq(Expo.userId, userId),
			isNull(Expo.deletedAt)
		))
		.orderBy(Expo.createdAt)
		.execute();

	return result.map(project => ExpoModel.Query.parse(project));
}

export async function updateProject(appId: string, data: {
	easProjectId?: string;
	projectPath?: string;
	status?: 'creating' | 'ready' | 'active' | 'inactive' | 'failed';
}) {
	const result = await db
		.update(Expo)
		.set({
			...data,
			updatedAt: new Date(),
		})
		.where(and(
			eq(Expo.appId, appId),
			isNull(Expo.deletedAt)
		))
		.returning()
		.execute();

	const project = result[0];
	return project ? ExpoModel.Query.parse(project) : null;
}

export async function updateProjectStatus(appId: string, status: 'creating' | 'ready' | 'active' | 'inactive' | 'failed') {
	const result = await db
		.update(Expo)
		.set({
			status,
			updatedAt: new Date(),
		})
		.where(and(
			eq(Expo.appId, appId),
			isNull(Expo.deletedAt)
		))
		.returning()
		.execute();

	const project = result[0];
	return project ? ExpoModel.Query.parse(project) : null;
}

export async function deleteProject(appId: string) {
	await db
		.update(Expo)
		.set({
			deletedAt: new Date(),
			updatedAt: new Date(),
		})
		.where(eq(Expo.appId, appId))
		.execute();
}

export async function countUserProjects(userId: string) {
	const result = await db
		.select({ count: count() })
		.from(Expo)
		.where(and(
			eq(Expo.userId, userId),
			isNull(Expo.deletedAt)
		))
		.execute();

	return result[0]?.count || 0;
}