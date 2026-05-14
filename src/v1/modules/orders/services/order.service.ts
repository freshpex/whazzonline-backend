import { checkoutOrder } from '../repositories/order.repository.js';
import type { CheckoutInput } from '../validators/order.validator.js';

export const orderService = {
  checkout: (userId: string, payload: CheckoutInput) => checkoutOrder(userId, payload)
};
