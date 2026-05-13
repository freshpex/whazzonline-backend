import { describe, expect, it, vi } from 'vitest';
import { productService } from '../services/product.service.js';
import * as productRepository from '../repositories/product.repository.js';

const sampleProducts = [
  {
    id: 'p-001',
    name: 'Wireless Headphones',
    price: 25000,
    description: 'Comfortable headphones with clear sound.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics',
    stock: 20
  },
  {
    id: 'p-002',
    name: 'Smart Watch',
    price: 42000,
    description: 'Track activity, calls, and notifications.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Electronics',
    stock: 15
  }
];

describe('productService', () => {
  it('lists products with query and category filters', async () => {
    const listSpy = vi.spyOn(productRepository, 'listProducts').mockResolvedValue(sampleProducts);

    const results = await productService.list('watch', 'Electronics');

    expect(listSpy).toHaveBeenCalledWith('watch', 'Electronics');
    expect(results).toEqual(sampleProducts);
  });

  it('finds a product by id', async () => {
    const findSpy = vi.spyOn(productRepository, 'findProductById').mockResolvedValue(sampleProducts[1] ?? null);

    const product = await productService.findById('p-002');

    expect(findSpy).toHaveBeenCalledWith('p-002');
    expect(product?.name).toBe('Smart Watch');
  });
});
