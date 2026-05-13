import type { Request, Response, NextFunction } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { HttpError } from '../../../../shared/errors/http-error.js';
import { productService } from '../services/product.service.js';
import { getProduct, listProducts } from '../controllers/product.controller.js';

describe('productController', () => {
  it('returns filtered products in listProducts', () => {
    const req = { query: { q: 'watch' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;

    listProducts(req, res, vi.fn() as unknown as NextFunction);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: productService.list('watch', undefined)
    });
  });

  it('returns product data when product exists', () => {
    const req = { params: { id: 'p-001' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();

    getProduct(req, res, next as unknown as NextFunction);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: productService.findById('p-001')
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates to next with HttpError when product is missing', () => {
    const req = { params: { id: 'missing' } } as unknown as Request;
    const res = { json: vi.fn() } as unknown as Response;
    const next = vi.fn();

    getProduct(req, res, next as unknown as NextFunction);

    expect(next).toHaveBeenCalled();
    const errorArg = next.mock.calls[0]?.[0];
    expect(errorArg).toBeInstanceOf(HttpError);
    expect((errorArg as HttpError).statusCode).toBe(404);
  });
});
