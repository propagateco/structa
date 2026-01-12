export * as ExpoController from './expo.controller';

import { zod } from '../utils/zod';
import { z } from 'zod';
import { ExpoService } from './expo.service';
import { AppService } from '../app/app.service';
import { BrandingService } from '../branding/branding.service';
import { generateTenantProject } from './expo.template';
import { ExpoBuilder } from './expo.builder';

/**
 * Expo Project Management
 * ----------------------
 *
 * Business logic layer for handling Expo project creation and management.
 * Orchestrates project setup, validation, and integration with Expo services.
 */

export const createProject = zod(
	z.object({
		appId: z.string().min(1, 'App ID is required'),
		appName: z.string().min(1, 'App name is required').max(100, 'App name too long'),
		userId: z.string().min(1, 'User ID is required'),
	}),
	async (input) => {
		try {
			// Get app and branding data
			await AppService.fromID(input.appId); // Validate app exists
			const branding = await BrandingService.fromAppId(input.appId);

			// Generate slug from app name
			const slug = input.appName
				.toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^a-z0-9-]/g, '');

			if (!slug || slug.length < 2) {
				throw new Error('App name must contain at least 2 valid characters');
			}

			// Check if project already exists for this app
			const existingProject = await ExpoService.findProjectByAppId(input.appId);
			if (existingProject) {
				throw new Error(`Expo project already exists for app "${input.appName}"`);
			}

			// Create initial database record with status 'creating'
			await ExpoService.createProject({
				appId: input.appId,
				appName: input.appName,
				slug,
				userId: input.userId,
				status: 'creating',
			});

			// Generate project from template
			console.log('Generating tenant project...');
			const projectPath = await generateTenantProject({
				userId: input.userId,
				appName: input.appName,
				slug,
				branding: branding || {}
			});

			// Initialize EAS project
			console.log('Initializing EAS project...');
			const builder = new ExpoBuilder(projectPath, slug);
			const easProjectId = await builder.initializeProject();

			// Update database record with EAS data
			const updatedProject = await ExpoService.updateProject(input.appId, {
				easProjectId,
				projectPath,
				status: 'ready'
			});

			console.log(`Project created successfully: ${easProjectId}`);

			return {
				...updatedProject,
				easProjectId,
				message: 'Project created successfully. Check your Expo dashboard to verify.'
			};

		} catch (error) {
			console.error('Project creation failed:', error);
			
			// Update status to failed
			try {
				await ExpoService.updateProject(input.appId, { status: 'failed' });
			} catch (updateError) {
				console.error('Failed to update project status:', updateError);
			}
			
			throw error;
		}
	}
);

export const getProjectByAppId = zod(
	z.object({
		appId: z.string().min(1, 'App ID is required'),
		userId: z.string().min(1, 'User ID is required'),
	}),
	async (input) => {
		const project = await ExpoService.findProjectByAppId(input.appId);
		
		if (!project) {
			throw new Error('Expo project not found');
		}

		// Ensure user owns this project
		if (project.userId !== input.userId) {
			throw new Error('Access denied: You do not own this project');
		}

		return project;
	}
);

export const getUserProjects = zod(
	z.string().min(1, 'User ID is required'),
	async (userId) => {
		return await ExpoService.findProjectsByUserId(userId);
	}
);

export const deleteProject = zod(
	z.object({
		appId: z.string().min(1, 'App ID is required'),
		userId: z.string().min(1, 'User ID is required'),
	}),
	async (input) => {
		// Verify project exists and user owns it
		const project = await ExpoService.findProjectByAppId(input.appId);
		
		if (!project) {
			throw new Error('Expo project not found');
		}

		if (project.userId !== input.userId) {
			throw new Error('Access denied: You do not own this project');
		}

		// TODO: Add cleanup logic
		// - Cancel any running EAS builds
		// - Clean up project resources
		// - Notify relevant services

		await ExpoService.deleteProject(input.appId);
		
		return { success: true };
	}
);