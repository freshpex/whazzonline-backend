import type { CreateReviewPayload, ListProductsQuery } from '../validators/product.validator.js';
import {
  createOrUpdateProductReview,
  createProduct,
  ensureProductExists,
  findProductById,
  listProductCategories,
  listProductReviews,
  listProducts
} from '../repositories/product.repository.js';
import type { ProductCreateInput } from '../types/product.types.js';

export const productService = {
  list: (query: ListProductsQuery) =>
    listProducts({
      query: query.q,
      category: query.category,
      page: query.page,
      limit: query.limit
    }),
  findById: (id: string) => findProductById(id),
  create: (payload: ProductCreateInput) => createProduct(payload),
  listCategories: () => listProductCategories(),
  getReviews: async (productId: string) => {
    await ensureProductExists(productId);
    return listProductReviews(productId);
  },
  createReview: async (productId: string, userId: string, payload: CreateReviewPayload) => {
    await ensureProductExists(productId);
    return createOrUpdateProductReview({
      productId,
      userId,
      rating: payload.rating,
      comment: payload.comment
    });
  }
};
