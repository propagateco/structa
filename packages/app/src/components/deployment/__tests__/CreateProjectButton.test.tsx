import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateProjectButton } from '../CreateProjectButton';
import { useCreateProjectMutation } from '@/clients/expo/expo.mutation.client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/clients/expo/expo.mutation.client');
vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual('@tanstack/react-query');
	return {
		...actual,
		useQuery: vi.fn(),
	};
});
vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockedUseCreateProjectMutation = vi.mocked(useCreateProjectMutation);
const mockedUseQuery = vi.mocked(useQuery);
const mockedToast = vi.mocked(toast);

describe('CreateProjectButton', () => {
	let queryClient: QueryClient;
	
	const mockApp = {
		id: 'app-123',
		name: 'Test App',
		description: 'Test app description',
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const mockMutationResult = {
		mutateAsync: vi.fn(),
		isPending: false,
		isError: false,
		error: null,
		data: null,
		reset: vi.fn(),
		mutate: vi.fn(),
		isIdle: true,
		isSuccess: false,
		failureCount: 0,
		failureReason: null,
		status: 'idle' as const,
		submittedAt: 0,
		variables: undefined,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		
		mockedUseQuery.mockReturnValue({
			data: mockApp,
			isLoading: false,
			error: null,
			isError: false,
		} as any);
		
		mockedUseCreateProjectMutation.mockReturnValue(mockMutationResult);
	});

	const renderComponent = (props = {}) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<CreateProjectButton {...props} />
			</QueryClientProvider>
		);
	};

	describe('Component Rendering', () => {
		it('should render the create project button', () => {
			renderComponent();
			
			expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
		});

		it('should not render when app data is not available', () => {
			mockedUseQuery.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
				isError: false,
			} as any);

			const { container } = renderComponent();
			
			expect(container.firstChild).toBeNull();
		});

		it('should apply custom className', () => {
			renderComponent({ className: 'custom-class' });
			
			const button = screen.getByRole('button', { name: /create project/i });
			expect(button).toHaveClass('custom-class');
		});
	});

	describe('Dialog Interaction', () => {
		it('should open dialog when button is clicked', async () => {
			renderComponent();
			
			const button = screen.getByRole('button', { name: /create project/i });
			fireEvent.click(button);
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			expect(screen.getByText(/this will create a new expo project/i)).toBeInTheDocument();
			expect(screen.getByText('Test App')).toBeInTheDocument();
			expect(screen.getByText('Expo managed workflow')).toBeInTheDocument();
		});

		it('should close dialog when cancel is clicked', async () => {
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			// Click cancel
			fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
			
			await waitFor(() => {
				expect(screen.queryByText('Create Expo Project')).not.toBeInTheDocument();
			});
		});

		it('should close dialog when clicking outside', async () => {
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			// Click on backdrop (outside dialog)
			const backdrop = document.querySelector('[data-state="open"]')?.parentElement;
			if (backdrop) {
				fireEvent.click(backdrop);
			}
			
			await waitFor(() => {
				expect(screen.queryByText('Create Expo Project')).not.toBeInTheDocument();
			});
		});
	});

	describe('Project Creation', () => {
		it('should create project successfully', async () => {
			const mockProjectData = {
				project: {
					id: 'expo-123',
					appId: 'app-123',
					appName: 'Test App',
					slug: 'test-app',
				},
				projectName: 'Test App',
				projectSlug: 'test-app',
			};
			
			mockMutationResult.mutateAsync.mockResolvedValue(mockProjectData);
			
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			// Click create project button in dialog
			fireEvent.click(screen.getByRole('button', { name: /^create project$/i }));
			
			await waitFor(() => {
				expect(mockMutationResult.mutateAsync).toHaveBeenCalledWith({
					appId: 'app-123',
					appName: 'Test App',
				});
			});
		});

		it('should handle creation errors gracefully', async () => {
			const errorMessage = 'Project creation failed';
			mockMutationResult.mutateAsync.mockRejectedValue(new Error(errorMessage));
			
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			// Click create project button in dialog
			fireEvent.click(screen.getByRole('button', { name: /^create project$/i }));
			
			await waitFor(() => {
				expect(mockMutationResult.mutateAsync).toHaveBeenCalled();
			});
			
			// Dialog should remain open since error handling is done in mutation
			expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
		});

		it('should not create project when app data is missing', async () => {
			mockedUseQuery.mockReturnValue({
				data: null,
				isLoading: false,
				error: null,
				isError: false,
			} as any);

			renderComponent();
			
			// Component should not render, so no mutation should be possible
			expect(screen.queryByRole('button', { name: /create project/i })).not.toBeInTheDocument();
		});
	});

	describe('Loading States', () => {
		it('should disable buttons during project creation', async () => {
			mockMutationResult.isPending = true;
			mockedUseCreateProjectMutation.mockReturnValue(mockMutationResult);
			
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			const cancelButton = screen.getByRole('button', { name: /cancel/i });
			const createButton = screen.getByRole('button', { name: /^create project$/i });
			
			expect(cancelButton).toBeDisabled();
			expect(createButton).toBeDisabled();
		});

		it('should show loading state on create button', async () => {
			mockMutationResult.isPending = true;
			mockedUseCreateProjectMutation.mockReturnValue(mockMutationResult);
			
			renderComponent();
			
			// Open dialog
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			// The Button component should show loading state when isLoading prop is true
			// This is handled by the Button component's isLoading prop
			const createButton = screen.getByRole('button', { name: /^create project$/i });
			expect(createButton).toBeDisabled();
		});
	});

	describe('App Information Display', () => {
		it('should display app name in dialog', async () => {
			renderComponent();
			
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Test App')).toBeInTheDocument();
			});
		});

		it('should display project type information', async () => {
			renderComponent();
			
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Project Type')).toBeInTheDocument();
				expect(screen.getByText('Expo managed workflow')).toBeInTheDocument();
			});
		});

		it('should include helpful description text', async () => {
			renderComponent();
			
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText(/this will create a new expo project for "test app"/i)).toBeInTheDocument();
				expect(screen.getByText(/this is a one-time setup required before you can deploy/i)).toBeInTheDocument();
			});
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes', async () => {
			renderComponent();
			
			const button = screen.getByRole('button', { name: /create project/i });
			expect(button).toBeInTheDocument();
			
			// Dialog should have proper accessibility attributes
			fireEvent.click(button);
			
			await waitFor(() => {
				const dialog = screen.getByRole('dialog');
				expect(dialog).toHaveAttribute('aria-describedby');
				expect(dialog).toHaveAttribute('aria-labelledby');
			});
		});

		it('should support keyboard navigation', async () => {
			renderComponent();
			
			const button = screen.getByRole('button', { name: /create project/i });
			
			// Focus and activate with keyboard
			button.focus();
			fireEvent.keyDown(button, { key: 'Enter' });
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle mutation errors without crashing', async () => {
			// Simulate console.error to check for unhandled errors
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			
			mockMutationResult.mutateAsync.mockRejectedValue(new Error('Network error'));
			
			renderComponent();
			
			fireEvent.click(screen.getByRole('button', { name: /create project/i }));
			
			await waitFor(() => {
				expect(screen.getByText('Create Expo Project')).toBeInTheDocument();
			});
			
			fireEvent.click(screen.getByRole('button', { name: /^create project$/i }));
			
			await waitFor(() => {
				expect(mockMutationResult.mutateAsync).toHaveBeenCalled();
			});
			
			// Should not log unhandled errors
			expect(consoleSpy).not.toHaveBeenCalled();
			
			consoleSpy.mockRestore();
		});
	});
});