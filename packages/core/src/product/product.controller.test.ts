import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as ProductController from './product.controller';
import * as ProductService from './product.service';
import * as ProductContentService from './product-content.service';

// Mock dependencies
vi.mock('./product.service');
vi.mock('./product-content.service');

describe('ProductController', () => {
	const mockProductId = 'clh3zxe7g0000qjv5d5w5f6x';
	const mockUserId = 'clh3zxe7g0001qjv5d5w5f7x';
	const mockAppId = 'clh3zxe7g0002qjv5d5w5f8x';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('createProduct', () => {
		it('should create a product with the provided data', async () => {
			const mockProduct = {
				id: mockProductId,
				userId: mockUserId,
				appId: mockAppId,
				name: 'Test Product',
				description: 'Test Description',
			};

			vi.mocked(ProductService.create).mockResolvedValue(mockProduct as any);

			const result = await ProductController.createProduct({
				userId: mockUserId,
				appId: mockAppId,
				productData: {
					name: 'Test Product',
					description: 'Test Description',
					durationWeeks: 8,
					difficultyLevel: 'intermediate',
					daysPerWeek: 4,
					trainingStyle: 'strength',
				},
			});

			expect(result).toEqual(mockProduct);
			expect(ProductService.create).toHaveBeenCalledWith({
				userId: mockUserId,
				appId: mockAppId,
				name: 'Test Product',
				description: 'Test Description',
				durationWeeks: 8,
				difficultyLevel: 'intermediate',
				daysPerWeek: 4,
				trainingStyle: 'strength',
			});
		});
	});

	describe('getProductWithContent', () => {
		it('should retrieve product with organized content', async () => {
			const mockProduct = {
				id: mockProductId,
				name: 'Test Product',
			};

			const mockContent = [
				{
					id: 'content1',
					productId: mockProductId,
					weekNumber: 1,
					dayNumber: 1,
					orderIndex: 0,
					contentType: 'workout' as const,
					title: 'Workout 1',
				},
				{
					id: 'content2',
					productId: mockProductId,
					weekNumber: 1,
					dayNumber: 2,
					orderIndex: 0,
					contentType: 'video' as const,
					title: 'Video 1',
				},
			];

			vi.mocked(ProductService.fromId).mockResolvedValue(mockProduct as any);
			vi.mocked(ProductContentService.fromProductId).mockResolvedValue(mockContent as any);

			const result = await ProductController.getProductWithContent(mockProductId);

			expect(result.product).toEqual(mockProduct);
			expect(result.content[1][1]).toEqual([mockContent[0]]);
			expect(result.content[1][2]).toEqual([mockContent[1]]);
			expect(ProductService.fromId).toHaveBeenCalledWith(mockProductId);
			expect(ProductContentService.fromProductId).toHaveBeenCalledWith(mockProductId);
		});

		it('should throw error if product not found', async () => {
			vi.mocked(ProductService.fromId).mockResolvedValue(null as any);

			await expect(
				ProductController.getProductWithContent(mockProductId)
			).rejects.toThrow('Product not found');
		});
	});

	describe('copyWeek', () => {
		it('should copy content from one week to another', async () => {
			const sourceContent = [
				{
					id: 'content1',
					productId: mockProductId,
					weekNumber: 1,
					dayNumber: 1,
					orderIndex: 0,
					contentType: 'workout' as const,
					contentId: 'workout1',
					title: 'Workout 1',
					description: 'Test workout',
					duration: 45,
					metadata: { test: true },
				},
			];

			vi.mocked(ProductContentService.fromProductId).mockResolvedValue(sourceContent as any);
			vi.mocked(ProductContentService.create).mockResolvedValue({ id: 'newcontent1' } as any);

			const result = await ProductController.copyWeek({
				productId: mockProductId,
				sourceWeek: 1,
				targetWeek: 2,
			});

			expect(result).toHaveLength(1);
			expect(ProductContentService.create).toHaveBeenCalledWith({
				productId: mockProductId,
				weekNumber: 2,
				dayNumber: 1,
				orderIndex: 0,
				contentType: 'workout',
				contentId: 'workout1',
				title: 'Workout 1',
				description: 'Test workout',
				duration: 45,
				metadata: {
					test: true,
					copiedFrom: {
						weekNumber: 1,
						contentId: 'content1',
					},
				},
			});
		});
	});
});