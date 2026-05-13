import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required.'),
  price: z.coerce.number().positive('Price must be greater than zero.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().url('Image URL must be a valid URL.'),
  category: z.string().min(1, 'Category is required.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative.')
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;
