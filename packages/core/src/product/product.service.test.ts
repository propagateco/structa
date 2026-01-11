import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as ProductService from './product.service';
import { db } from '../drizzle';
import { createId } from '@paralleldrive/cuid2';

// Mock dependencies
vi.mock('../drizzle');
vi.mock('@paralleldrive/cuid2');

describe('ProductService', () => {
	const mockId = 'clh3zxe7g0000qjv5d5w5f6x';
	const mockUserId = 'clh3zxe7g0001qjv5d5w5f7x';
	const mockAppId = 'clh3zxe7g0002qjv5d5w5f8x';

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(createId).mockReturnValue(mockId);
	});

	describe('create', () => {
		it('should create a new product with required fields', async () => {
			const mockProduct = {
				id: mockId,
				userId: mockUserId,
				appId: mockAppId,
				name: 'Test Product',
				description: 'Test Description',
				coverImage: null,
				durationWeeks: 8,
				difficultyLevel: 'intermediate' as const,
				daysPerWeek: 4,
				trainingStyle: 'strength' as const,
				prerequisites: null,
				goals: null,
				metadata: null,
				active: true,
				publishedAt: null,
				publishedName: null,
				publishedDescription: null,
				publishedCoverImage: null,
				publishedDurationWeeks: null,
				publishedDifficultyLevel: null,
				publishedDaysPerWeek: null,
				publishedTrainingStyle: null,
				publishedPrerequisites: null,
				publishedGoals: null,
				publishedMetadata: null,
				createdAt: new Date('2023-01-01T00:00:00Z'),
				updatedAt: new Date('2023-01-01T00:00:00Z'),
				deletedAt: null,
			};

			const mockTx = {
				insert: vi.fn().mockReturnThis(),
				values: vi.fn().mockReturnThis(),
				returning: vi.fn().mockReturnThis(),
				execute: vi.fn().mockResolvedValue([mockProduct]),
			};

			vi.mocked(db.transaction).mockImplementation(async (fn) => fn(mockTx as any));

			const result = await ProductService.create({
				userId: mockUserId,
				appId: mockAppId,
				name: 'Test Product',
				description: 'Test Description',
				durationWeeks: 8,
				difficultyLevel: 'intermediate',
				daysPerWeek: 4,
				trainingStyle: 'strength',
			});

			expect(result).toEqual(mockProduct);
			expect(mockTx.insert).toHaveBeenCalledWith(expect.any(Object));
			expect(mockTx.values).toHaveBeenCalledWith(
				expect.objectContaining({
					id: mockId,
					userId: mockUserId,
					appId: mockAppId,
					name: 'Test Product',
					description: 'Test Description',
					durationWeeks: 8,
					difficultyLevel: 'intermediate',
					daysPerWeek: 4,
					trainingStyle: 'strength',
				})
			);
		});
	});

	describe('fromId', () => {
		it('should retrieve a product by id', async () => {
			const mockProduct = {
				id: mockId,
				name: 'Test Product',
			};

			const mockTx = {
				select: vi.fn().mockReturnThis(),
				from: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				execute: vi.fn().mockResolvedValue([mockProduct]),
			};

			vi.mocked(db.transaction).mockImplementation(async (fn) => fn(mockTx as any));

			const result = await ProductService.fromId(mockId);

			expect(result).toEqual(mockProduct);
			expect(mockTx.select).toHaveBeenCalled();
			expect(mockTx.where).toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should update a product', async () => {
			const mockUpdatedProduct = {
				id: mockId,
				userId: mockUserId,
				appId: mockAppId,
				name: 'Updated Product',
				description: 'Test Description',
				coverImage: null,
				durationWeeks: 8,
				difficultyLevel: 'intermediate' as const,
				daysPerWeek: 4,
				trainingStyle: 'strength' as const,
				prerequisites: null,
				goals: null,
				metadata: null,
				active: true,
				publishedAt: null,
				publishedName: null,
				publishedDescription: null,
				publishedCoverImage: null,
				publishedDurationWeeks: null,
				publishedDifficultyLevel: null,
				publishedDaysPerWeek: null,
				publishedTrainingStyle: null,
				publishedPrerequisites: null,
				publishedGoals: null,
				publishedMetadata: null,
				createdAt: new Date('2023-01-01T00:00:00Z'),
				updatedAt: new Date('2023-01-01T00:00:00Z'),
				deletedAt: null,
			};

			const mockTx = {
				update: vi.fn().mockReturnThis(),
				set: vi.fn().mockReturnThis(),
				where: vi.fn().mockReturnThis(),
				returning: vi.fn().mockReturnThis(),
				execute: vi.fn().mockResolvedValue([mockUpdatedProduct]),
			};

			vi.mocked(db.transaction).mockImplementation(async (fn) => fn(mockTx as any));

			const result = await ProductService.update({
				id: mockId,
				name: 'Updated Product',
			});

			expect(result).toEqual(mockUpdatedProduct);
			expect(mockTx.update).toHaveBeenCalledWith(expect.any(Object));
			expect(mockTx.set).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'Updated Product',
				})
			);
		});
	});
});