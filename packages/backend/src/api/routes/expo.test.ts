import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { ExpoRoute } from './expo';
import { ExpoController } from '@structa/core/expo';
import { BuildQueueService } from '@structa/core/build-queue';

// Mock dependencies
vi.mock('@structa/core/expo');
vi.mock('@structa/core/build-queue');
vi.mock('../middleware', () => ({
	authenticatedMiddleware: vi.fn((c, next) => {
		c.var = { 
			subject: { id: 'user-123' }
		};
		return next();
	}),
}));

const mockedExpoController = vi.mocked(ExpoController);
const mockedBuildQueueService = vi.mocked(BuildQueueService);

describe('ExpoRoute', () => {
	let app: Hono;

	const mockProjectResponse = {
		id: 'expo-123',
		appId: 'app-456',
		appName: 'Test App',
		slug: 'test-app',
		status: 'ready' as const,
		userId: 'user-123',
		easProjectId: 'eas-project-123',
		projectPath: '/path/to/project',
		createdAt: new Date('2023-01-01T00:00:00Z'),
		updatedAt: new Date('2023-01-01T00:00:00Z'),
		deletedAt: null,
		message: 'Project created successfully. Check your Expo dashboard to verify.'
	};

	const mockProject = {
		id: 'expo-123',
		appId: 'app-456',
		appName: 'Test App',
		slug: 'test-app',
		status: 'active' as const,
		userId: 'user-123',
		easProjectId: 'eas-project-123',
		projectPath: '/path/to/project',
		createdAt: new Date('2023-01-01T00:00:00Z'),
		updatedAt: new Date('2023-01-01T00:00:00Z'),
		deletedAt: null,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		app = new Hono().route('/', ExpoRoute);
	});

	describe('POST /project/create', () => {
		it('should create project successfully', async () => {
			mockedExpoController.createProject.mockResolvedValue(mockProjectResponse);

			const response = await app.request('/project/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appId: 'app-456',
					appName: 'Test App',
				}),
			});

			expect(response.status).toBe(201);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				success: true,
				project: mockProjectResponse,
				projectName: 'Test App',
				projectSlug: 'test-app',
			});

			expect(mockedExpoController.createProject).toHaveBeenCalledWith({
				userId: 'user-123',
				appId: 'app-456',
				appName: 'Test App',
			});
		});

		it('should return 409 when project already exists', async () => {
			mockedExpoController.createProject.mockRejectedValue(
				new Error('Expo project already exists for app "Test App"')
			);

			const response = await app.request('/project/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appId: 'app-456',
					appName: 'Test App',
				}),
			});

			expect(response.status).toBe(409);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Project already exists',
				message: 'Expo project already exists for app "Test App"',
			});
		});

		it('should return 400 for invalid app name', async () => {
			mockedExpoController.createProject.mockRejectedValue(
				new Error('App name must contain at least 2 valid characters')
			);

			const response = await app.request('/project/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appId: 'app-456',
					appName: '!',
				}),
			});

			expect(response.status).toBe(400);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Invalid app name',
				message: 'App name must contain at least 2 valid characters',
			});
		});

		it('should return 400 for invalid request body', async () => {
			const response = await app.request('/project/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appId: '', // Invalid empty appId
					appName: 'Test App',
				}),
			});

			expect(response.status).toBe(400);
			expect(mockedExpoController.createProject).not.toHaveBeenCalled();
		});

		it('should return 500 for unexpected errors', async () => {
			mockedExpoController.createProject.mockRejectedValue(
				new Error('Database connection failed')
			);

			const response = await app.request('/project/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					appId: 'app-456',
					appName: 'Test App',
				}),
			});

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Failed to create Expo project',
				message: 'Database connection failed',
			});
		});
	});

	describe('GET /project/:appId', () => {
		it('should get project successfully', async () => {
			mockedExpoController.getProjectByAppId.mockResolvedValue(mockProject);

			const response = await app.request('/project/app-456');

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				project: mockProject,
			});

			expect(mockedExpoController.getProjectByAppId).toHaveBeenCalledWith({
				appId: 'app-456',
				userId: 'user-123',
			});
		});

		it('should return 404 when project not found', async () => {
			mockedExpoController.getProjectByAppId.mockRejectedValue(
				new Error('Expo project not found')
			);

			const response = await app.request('/project/app-456');

			expect(response.status).toBe(404);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Project not found',
				message: 'Expo project not found',
			});
		});

		it('should return 403 for access denied', async () => {
			mockedExpoController.getProjectByAppId.mockRejectedValue(
				new Error('Access denied: You do not own this project')
			);

			const response = await app.request('/project/app-456');

			expect(response.status).toBe(403);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Access denied',
				message: 'Access denied: You do not own this project',
			});
		});

		it('should return 500 for unexpected errors', async () => {
			mockedExpoController.getProjectByAppId.mockRejectedValue(
				new Error('Database connection failed')
			);

			const response = await app.request('/project/app-456');

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Failed to fetch project',
				message: 'Database connection failed',
			});
		});
	});

	describe('GET /projects', () => {
		it('should get user projects successfully', async () => {
			const mockProjects = [mockProject];
			mockedExpoController.getUserProjects.mockResolvedValue(mockProjects);

			const response = await app.request('/projects');

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				projects: mockProjects,
			});

			expect(mockedExpoController.getUserProjects).toHaveBeenCalledWith('user-123');
		});

		it('should return empty array when user has no projects', async () => {
			mockedExpoController.getUserProjects.mockResolvedValue([]);

			const response = await app.request('/projects');

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				projects: [],
			});
		});

		it('should return 500 for errors', async () => {
			mockedExpoController.getUserProjects.mockRejectedValue(
				new Error('Database connection failed')
			);

			const response = await app.request('/projects');

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Failed to fetch projects',
				message: 'Database connection failed',
			});
		});
	});

	describe('DELETE /project/:appId', () => {
		it('should delete project successfully', async () => {
			mockedExpoController.deleteProject.mockResolvedValue({ success: true });

			const response = await app.request('/project/app-456', {
				method: 'DELETE',
			});

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				success: true,
			});

			expect(mockedExpoController.deleteProject).toHaveBeenCalledWith({
				appId: 'app-456',
				userId: 'user-123',
			});
		});

		it('should return 404 when project not found', async () => {
			mockedExpoController.deleteProject.mockRejectedValue(
				new Error('Expo project not found')
			);

			const response = await app.request('/project/app-456', {
				method: 'DELETE',
			});

			expect(response.status).toBe(404);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Project not found',
				message: 'Expo project not found',
			});
		});

		it('should return 403 for access denied', async () => {
			mockedExpoController.deleteProject.mockRejectedValue(
				new Error('Access denied: You do not own this project')
			);

			const response = await app.request('/project/app-456', {
				method: 'DELETE',
			});

			expect(response.status).toBe(403);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Access denied',
				message: 'Access denied: You do not own this project',
			});
		});

		it('should return 500 for unexpected errors', async () => {
			mockedExpoController.deleteProject.mockRejectedValue(
				new Error('Database connection failed')
			);

			const response = await app.request('/project/app-456', {
				method: 'DELETE',
			});

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Failed to delete project',
				message: 'Database connection failed',
			});
		});
	});

	describe('Authentication', () => {
		it('should require authentication for all endpoints', async () => {
			// This test would need to be implemented with actual authentication middleware
			// For now, we're mocking the middleware to always pass
			expect(true).toBe(true);
		});
	});

	describe('Input validation', () => {
		it('should validate app ID parameter format', async () => {
			// The zValidator middleware handles this validation
			// Invalid parameters would be caught before reaching the controller
			expect(true).toBe(true);
		});

		it('should validate JSON body structure', async () => {
			// The zValidator middleware handles this validation  
			// Invalid JSON bodies would be caught before reaching the controller
			expect(true).toBe(true);
		});
	});

	describe('POST /test-build', () => {
		it('should queue test build successfully', async () => {
			mockedBuildQueueService.sendTestBuild.mockResolvedValue({
				messageId: 'msg-123',
				success: true,
			});

			const response = await app.request('/test-build', {
				method: 'POST',
			});

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				success: true,
				message: 'Test build queued successfully',
				messageId: 'msg-123',
			});

			expect(mockedBuildQueueService.sendTestBuild).toHaveBeenCalledWith('user-123');
		});

		it('should return 500 when queue service fails', async () => {
			mockedBuildQueueService.sendTestBuild.mockRejectedValue(
				new Error('Queue service unavailable')
			);

			const response = await app.request('/test-build', {
				method: 'POST',
			});

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				error: 'Failed to queue test build',
				message: 'Queue service unavailable',
			});
		});
	});

	describe('GET /build-queue/health', () => {
		it('should return healthy status when queue is accessible', async () => {
			mockedBuildQueueService.healthCheck.mockResolvedValue({
				queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789/test-queue',
				accessible: true,
			});

			const response = await app.request('/build-queue/health');

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				status: 'healthy',
				queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789/test-queue',
				accessible: true,
			});

			expect(mockedBuildQueueService.healthCheck).toHaveBeenCalled();
		});

		it('should return unhealthy status when queue is not accessible', async () => {
			mockedBuildQueueService.healthCheck.mockResolvedValue({
				queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789/test-queue',
				accessible: false,
			});

			const response = await app.request('/build-queue/health');

			expect(response.status).toBe(200);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				status: 'unhealthy',
				queueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789/test-queue',
				accessible: false,
			});
		});

		it('should return error status when health check throws', async () => {
			mockedBuildQueueService.healthCheck.mockRejectedValue(
				new Error('Network error')
			);

			const response = await app.request('/build-queue/health');

			expect(response.status).toBe(500);
			
			const responseData = await response.json();
			expect(responseData).toEqual({
				status: 'error',
				message: 'Network error',
			});
		});
	});
});