import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  price: z.coerce.number().positive('Price must be greater than zero.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().url('Image URL must be a valid URL.'),
  category: z.string().min(1, 'Category is required.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.')
});

export const listProductsQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(9)
});

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(500, 'Comment must be 500 characters or less.')
    .optional()
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type CreateReviewPayload = z.infer<typeof createReviewSchema>;
