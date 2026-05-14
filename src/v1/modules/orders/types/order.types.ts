export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'wallet' | 'cash_on_delivery';

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutPayload = {
  paymentMethod: PaymentMethod;
  items: CheckoutItemInput[];
};

export type CheckoutResult = {
  orderId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: 'paid';
  reference: string;
};
