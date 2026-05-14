import { z } from 'zod';

export const checkoutSchema = z.object({
  paymentMethod: z.enum(['card', 'bank_transfer', 'ussd', 'wallet', 'cash_on_delivery']),
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product identifier.'),
        quantity: z.coerce.number().int().min(1).max(50)
      })
    )
    .min(1, 'Please add at least one item before checkout.')
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
