import { pool } from '../../../../shared/db/pool.js';
import { HttpError } from '../../../../shared/errors/http-error.js';
import type { CheckoutInput } from '../validators/order.validator.js';
import type { CheckoutResult } from '../types/order.types.js';

type ProductStockRow = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

function buildReference() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WHZ-${Date.now()}-${random}`;
}

export async function checkoutOrder(userId: string, payload: CheckoutInput): Promise<CheckoutResult> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const productIds = payload.items.map((item) => item.productId);
    const uniqueProductIds = Array.from(new Set(productIds));

    const productsResult = await client.query<ProductStockRow>(
      `
        SELECT id, name, price, stock
        FROM products
        WHERE id = ANY($1::uuid[])
        FOR UPDATE
      `,
      [uniqueProductIds]
    );

    const productMap = new Map(productsResult.rows.map((row) => [row.id, row]));

    let totalAmount = 0;
    for (const item of payload.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new HttpError(404, 'One of the products in your cart no longer exists.');
      }
      if (product.stock < item.quantity) {
        throw new HttpError(400, `Only ${product.stock} units left for ${product.name}.`);
      }
      totalAmount += product.price * item.quantity;
    }

    const orderInsert = await client.query<{ id: string }>(
      `
        INSERT INTO orders (user_id, status, total_amount)
        VALUES ($1, 'paid', $2)
        RETURNING id
      `,
      [userId, totalAmount]
    );

    const orderId = orderInsert.rows[0]?.id;
    if (!orderId) {
      throw new Error('Failed to create order');
    }

    for (const item of payload.items) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2, $3, $4)
        `,
        [orderId, item.productId, item.quantity, product.price]
      );

      await client.query(
        `
          UPDATE products
          SET stock = stock - $2
          WHERE id = $1
        `,
        [item.productId, item.quantity]
      );
    }

    await client.query('COMMIT');

    return {
      orderId,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      status: 'paid',
      reference: buildReference()
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
