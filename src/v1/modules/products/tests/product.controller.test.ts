import type { Request, Response, NextFunction } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { productService } from '../services/product.service.js';
import { getProduct, listProducts } from '../controllers/product.controller.js';

const sampleProduct = {
  id: 'p-001',
  name: 'Wireless Headphones',
  price: 25000,
  description: 'Comfortable headphones with clear sound.',
  imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  category: 'Electronics',
  stock: 20
};

describe('productController', () => {
  it('returns filtered products in listProducts', async () => {
    const req = { query: { q: 'watch' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();
    vi.spyOn(productService, 'list').mockResolvedValue([sampleProduct]);

    await listProducts(req, res, next as unknown as NextFunction);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [sampleProduct]
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns product data when product exists', async () => {
    const req = { params: { id: 'p-001' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();
    vi.spyOn(productService, 'findById').mockResolvedValue(sampleProduct);

    await getProduct(req, res, next as unknown as NextFunction);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: sampleProduct
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates to next with HttpError when product is missing', async () => {
    const req = { params: { id: 'missing' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();
    vi.spyOn(productService, 'findById').mockResolvedValue(null);

    await getProduct(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0]?.[0];
    expect(errorArg).toBeInstanceOf(HttpError);
    expect((errorArg as HttpError).statusCode).toBe(404);
  });
});
