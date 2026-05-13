import { describe, expect, it } from 'vitest';
import { productService } from '../services/product.service.js';

describe('productService', () => {
  it('lists products and filters by query and category', () => {
    const allProducts = productService.list();
    expect(allProducts.length).toBeGreaterThan(0);

    const queryResult = productService.list('watch');
    expect(queryResult.some((product) => product.name.toLowerCase().includes('watch'))).toBe(true);

    const categoryResult = productService.list(undefined, 'Home');
    expect(categoryResult.every((product) => product.category === 'Home')).toBe(true);
  });

  it('finds a product by id', () => {
    const product = productService.findById('p-002');
    expect(product?.name).toBe('Smart Watch');
  });
});
