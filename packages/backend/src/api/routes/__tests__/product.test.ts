import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { ProductRoute } from '../product';
import { ProductService, ProductController } from '@structa/core/product';

// Mock the core services
vi.mock('@structa/core/product', () => ({
  ProductService: {
    fromAppId: vi.fn(),
  },
  ProductController: {
    createProduct: vi.fn(),
    getProductWithContent: vi.fn(),
    updateProduct: vi.fn(),
  },
  ProductModel: {
    MutateServer: {
      extend: vi.fn().mockReturnValue({
        omit: vi.fn().mockReturnValue({
          parse: vi.fn((data) => data),
        }),
      }),
    },
    Query: {
      parse: vi.fn((data) => data),
    },
  },
  ProductContentModel: {},
  ProductContentService: {},
}));

// Mock authentication middleware
vi.mock('../../middleware', () => ({
  authenticatedMiddleware: vi.fn((c: any, next: any) => {
    c.var = {
      subject: {
        id: 'test-user-id',
        workspaceId: 'test-app-id',
      },
    };
    return next();
  }),
}));

describe('Product API Routes', () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route('/product', ProductRoute);
  });

  describe('GET /product', () => {
    it('should return an array of products when products exist', async () => {
      const mockProducts = [
        {
          id: 'product-1',
          name: 'Elite Racing Program',
          appId: 'test-app-id',
          userId: 'test-user-id',
          durationWeeks: 12,
          difficultyLevel: 'advanced',
        },
        {
          id: 'product-2',
          name: 'Half Marathon Plan',
          appId: 'test-app-id',
          userId: 'test-user-id',
          durationWeeks: 4,
          difficultyLevel: 'beginner',
        },
      ];

      vi.mocked(ProductService.fromAppId).mockResolvedValue(mockProducts);

      const response = await app.request('/product', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockProducts);
      expect(ProductService.fromAppId).toHaveBeenCalledWith('test-app-id');
    });

    it('should return 404 when no products found', async () => {
      vi.mocked(ProductService.fromAppId).mockResolvedValue(null);

      const response = await app.request('/product', {
        method: 'GET',
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ error: 'No products found' });
    });

    it('should return empty array when ProductService returns empty array', async () => {
      vi.mocked(ProductService.fromAppId).mockResolvedValue([]);

      const response = await app.request('/product', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual([]);
    });
  });

  describe('GET /product/:id', () => {
    it('should return product with content', async () => {
      const mockProductWithContent = {
        product: {
          id: 'product-1',
          name: 'Test Product',
        },
        content: {
          weeks: [],
        },
      };

      vi.mocked(ProductController.getProductWithContent).mockResolvedValue(
        mockProductWithContent
      );

      const response = await app.request('/product/product-1', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockProductWithContent);
      expect(ProductController.getProductWithContent).toHaveBeenCalledWith('product-1');
    });
  });

  describe('POST /product', () => {
    it('should create a new product', async () => {
      const newProductData = {
        name: 'New Product',
        description: 'New Description',
      };

      const createdProduct = {
        id: 'new-product-id',
        ...newProductData,
        userId: 'test-user-id',
        appId: 'test-app-id',
      };

      vi.mocked(ProductController.createProduct).mockResolvedValue(createdProduct);

      const response = await app.request('/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProductData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toEqual(createdProduct);
      expect(ProductController.createProduct).toHaveBeenCalledWith({
        userId: 'test-user-id',
        appId: 'test-app-id',
        productData: newProductData,
      });
    });
  });
});