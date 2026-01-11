import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getProduct } from '../product.query.client';
import { api } from '@/lib/api';
import * as ProductModel from '@core/product/product.model';

// Mock the API and ProductModel
vi.mock('@/lib/api', () => ({
  api: {
    product: {
      $get: vi.fn(),
      ':id': {
        $get: vi.fn(),
      },
    },
  },
}));

vi.mock('@core/product/product.model', () => ({
  Query: {
    parse: vi.fn((data) => data),
  },
}));

describe('Product Query Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return products when API returns an array', async () => {
      const mockProducts = [
        {
          id: 'bm9d8ek6qacokw4k8iupgaof',
          name: 'Elite Racing Program',
          coverImage: 'https://example.com/image.jpg',
          durationWeeks: 12,
          difficultyLevel: 'advanced',
        },
        {
          id: 'ln1omty9ugp5c1hu93mehx99',
          name: 'Half Marathon Plan',
          coverImage: 'https://example.com/image2.jpg',
          durationWeeks: 4,
          difficultyLevel: 'beginner',
        },
      ];

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockProducts),
      };

      vi.mocked(api.product.$get).mockResolvedValue(mockResponse as any);

      const result = await getProducts();

      expect(api.product.$get).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(ProductModel.Query.parse).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        products: mockProducts,
      });
    });

    it('should return empty array when API returns 404', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: vi.fn(),
      };

      vi.mocked(api.product.$get).mockResolvedValue(mockResponse as any);

      const result = await getProducts();

      expect(result).toEqual({ products: [] });
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('should throw error when API returns other error status', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn(),
      };

      vi.mocked(api.product.$get).mockResolvedValue(mockResponse as any);

      await expect(getProducts()).rejects.toThrow('Failed to fetch products');
    });

    it('should handle empty array response', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(api.product.$get).mockResolvedValue(mockResponse as any);

      const result = await getProducts();

      expect(result).toEqual({ products: [] });
      expect(ProductModel.Query.parse).not.toHaveBeenCalled();
    });
  });

  describe('getProduct', () => {
    it('should return product with content when API call succeeds', async () => {
      const mockProduct = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
      };
      const mockContent = {
        weeks: [],
      };

      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          product: mockProduct,
          content: mockContent,
        }),
      };

      vi.mocked(api.product[':id'].$get).mockResolvedValue(mockResponse as any);

      const result = await getProduct('test-id');

      expect(api.product[':id'].$get).toHaveBeenCalledWith({
        param: { id: 'test-id' },
      });
      expect(ProductModel.Query.parse).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual({
        product: mockProduct,
        content: mockContent,
      });
    });

    it('should throw error when API call fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: vi.fn(),
      };

      vi.mocked(api.product[':id'].$get).mockResolvedValue(mockResponse as any);

      await expect(getProduct('test-id')).rejects.toThrow('Failed to fetch product');
    });
  });
});