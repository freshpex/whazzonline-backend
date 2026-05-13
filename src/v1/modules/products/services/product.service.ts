import type { ProductCreateInput } from '../types/product.types.js';
import { createProduct, findProductById, listProducts } from '../repositories/product.repository.js';

export const productService = {
  list: (query?: string, category?: string) => listProducts(query, category),
  findById: (id: string) => findProductById(id),
  create: (payload: ProductCreateInput) => createProduct(payload)
};
