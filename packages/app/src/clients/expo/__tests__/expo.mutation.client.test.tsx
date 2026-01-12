import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useCreateProjectMutation } from '../expo.mutation.client';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/lib/api', () => ({
	api: {
		expo: {
			project: {
				create: {
					$post: vi.fn(),
				},
			},
		},
	},
}));

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockedApi = vi.mocked(api);
const mockedToast = vi.mocked(toast);

describe('useCreateProjectMutation', () => {
	let queryClient: QueryClient;

	const createWrapper = () => {
		return ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
				mutations: {
					retry: false,
				},
			},
		});
	});

	describe('successful project creation', () => {
		it('should create project and show success toast', async () => {
			const mockSuccessResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({
					success: true,
					project: {
						id: 'expo-123',
						appId: 'app-456',
						appName: 'Test App',
						slug: 'test-app',
					},
					projectName: 'Test App',
					projectSlug: 'test-app',
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockSuccessResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			const mutationInput = {
				appId: 'app-456',
				appName: 'Test App',
			};

			await result.current.mutateAsync(mutationInput);

			expect(mockedApi.expo.project.create.$post).toHaveBeenCalledWith({
				json: mutationInput,
			});

			expect(mockSuccessResponse.json).toHaveBeenCalled();

			await waitFor(() => {
				expect(mockedToast.success).toHaveBeenCalledWith(
					'Expo project created successfully!',
					{
						description: 'Project "Test App" (test-app) is ready for deployments.',
					}
				);
			});
		});

		it('should return the project data from API response', async () => {
			const mockProjectData = {
				success: true,
				project: {
					id: 'expo-123',
					appId: 'app-456',
					appName: 'Test App',
					slug: 'test-app',
				},
				projectName: 'Test App',
				projectSlug: 'test-app',
			};

			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue(mockProjectData),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			const data = await result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			});

			expect(data).toEqual(mockProjectData);
		});
	});

	describe('API error handling', () => {
		it('should handle non-ok response with error message', async () => {
			const mockErrorResponse = {
				ok: false,
				json: vi.fn().mockResolvedValue({
					error: 'Project already exists',
					message: 'Expo project already exists for app "Test App"',
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockErrorResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			await expect(result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			})).rejects.toThrow('Expo project already exists for app "Test App"');

			expect(mockErrorResponse.json).toHaveBeenCalled();
		});

		it('should handle non-ok response with generic error fallback', async () => {
			const mockErrorResponse = {
				ok: false,
				json: vi.fn().mockResolvedValue({}), // No error field
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockErrorResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			await expect(result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			})).rejects.toThrow('Failed to create Expo project');
		});

		it('should handle network errors', async () => {
			const networkError = new Error('Network connection failed');
			mockedApi.expo.project.create.$post.mockRejectedValue(networkError);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			await expect(result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			})).rejects.toThrow('Network connection failed');
		});
	});

	describe('error toast notifications', () => {
		it('should show error toast on mutation failure', async () => {
			const mockErrorResponse = {
				ok: false,
				json: vi.fn().mockResolvedValue({
					error: 'Invalid app name',
					message: 'App name must contain at least 2 valid characters',
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockErrorResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			try {
				await result.current.mutateAsync({
					appId: 'app-456',
					appName: '!',
				});
			} catch (error) {
				// Expected to throw
			}

			await waitFor(() => {
				expect(mockedToast.error).toHaveBeenCalledWith(
					'Failed to create Expo project',
					{
						description: 'App name must contain at least 2 valid characters',
					}
				);
			});
		});

		it('should show error toast for network failures', async () => {
			const networkError = new Error('Connection timeout');
			mockedApi.expo.project.create.$post.mockRejectedValue(networkError);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			try {
				await result.current.mutateAsync({
					appId: 'app-456',
					appName: 'Test App',
				});
			} catch (error) {
				// Expected to throw
			}

			await waitFor(() => {
				expect(mockedToast.error).toHaveBeenCalledWith(
					'Failed to create Expo project',
					{
						description: 'Connection timeout',
					}
				);
			});
		});
	});

	describe('mutation states', () => {
		it('should have correct initial state', () => {
			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			expect(result.current.isPending).toBe(false);
			expect(result.current.isError).toBe(false);
			expect(result.current.isSuccess).toBe(false);
			expect(result.current.data).toBeUndefined();
			expect(result.current.error).toBeNull();
		});

		it('should update state during mutation lifecycle', async () => {
			let resolvePromise: (value: any) => void;
			const pendingPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});

			mockedApi.expo.project.create.$post.mockReturnValue(pendingPromise);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			// Start mutation
			const mutationPromise = result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			});

			// Should be pending
			await waitFor(() => {
				expect(result.current.isPending).toBe(true);
			});

			// Resolve with success
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({
					success: true,
					project: { id: 'expo-123' },
					projectName: 'Test App',
					projectSlug: 'test-app',
				}),
			};
			
			resolvePromise!(mockResponse);

			await mutationPromise;

			await waitFor(() => {
				expect(result.current.isPending).toBe(false);
				expect(result.current.isSuccess).toBe(true);
				expect(result.current.data).toBeDefined();
			});
		});

		it('should handle error state correctly', async () => {
			const mockErrorResponse = {
				ok: false,
				json: vi.fn().mockResolvedValue({
					error: 'Validation failed',
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockErrorResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			try {
				await result.current.mutateAsync({
					appId: 'app-456',
					appName: 'Test App',
				});
			} catch (error) {
				// Expected to throw
			}

			await waitFor(() => {
				expect(result.current.isPending).toBe(false);
				expect(result.current.isError).toBe(true);
				expect(result.current.error).toBeInstanceOf(Error);
			});
		});
	});

	describe('input validation', () => {
		it('should accept valid project data', async () => {
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({
					success: true,
					project: { id: 'expo-123' },
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			const validInputs = [
				{ appId: 'app-123', appName: 'My App' },
				{ appId: 'app-456', appName: 'Another App Name' },
				{ appId: 'app-789', appName: 'Test App 123' },
			];

			for (const input of validInputs) {
				await expect(result.current.mutateAsync(input)).resolves.toBeDefined();
			}
		});
	});

	describe('integration with TanStack Query', () => {
		it('should invalidate related queries on success', async () => {
			const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
			
			const mockResponse = {
				ok: true,
				json: vi.fn().mockResolvedValue({
					success: true,
					project: { id: 'expo-123' },
					projectName: 'Test App',
					projectSlug: 'test-app',
				}),
			};

			mockedApi.expo.project.create.$post.mockResolvedValue(mockResponse as any);

			const { result } = renderHook(() => useCreateProjectMutation(), {
				wrapper: createWrapper(),
			});

			await result.current.mutateAsync({
				appId: 'app-456',
				appName: 'Test App',
			});

			// The mutation should work with QueryClient integration
			// Specific query invalidation would be implemented in the mutation's onSuccess callback
			expect(invalidateQueriesSpy).toHaveBeenCalled();
		});
	});
});