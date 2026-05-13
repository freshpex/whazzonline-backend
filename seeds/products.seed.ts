import bcrypt from 'bcryptjs';
import { pool } from '../src/shared/db/pool.js';

const seedPassword = 'Test1234!';

const users = [
  { email: 'admin@whazzonline.app', phone: '+2348000000001', role: 'admin' },
  { email: 'vendor@whazzonline.com', phone: '+2348000000002', role: 'vendor' },
  { email: 'customer@whazzonline.com', phone: '+2348000000003', role: 'customer' },
  { email: 'buyer@whazzonline.com', phone: '+2348000000004', role: 'customer' }
] as const;

const products = [
  {
    name: 'Wireless Noise Cancelling Headphones',
    price: 74500,
    description: 'Comfortable over-ear headphones with clear calls, deep bass, and long battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics',
    stock: 18
  },
  {
    name: 'Smart Fitness Watch',
    price: 52000,
    description: 'Track steps, heart rate, workouts, sleep, calls, and notifications from your wrist.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Electronics',
    stock: 25
  },
  {
    name: 'Ergonomic Office Chair',
    price: 135000,
    description: 'Adjustable lumbar support, breathable mesh, and smooth wheels for long work days.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
    category: 'Home Office',
    stock: 9
  },
  {
    name: 'Ceramic Cookware Set',
    price: 88000,
    description: 'Non-stick ceramic pots and pans for everyday cooking with easy cleanup.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    category: 'Kitchen',
    stock: 14
  },
  {
    name: 'Leather Travel Backpack',
    price: 63000,
    description: 'Durable travel backpack with laptop space, padded straps, and hidden pockets.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Fashion',
    stock: 20
  },
  {
    name: 'Organic Cotton Bedding',
    price: 46000,
    description: 'Soft, breathable bedding set made with organic cotton for comfortable sleep.',
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    category: 'Home',
    stock: 16
  }
];

async function upsertUser(email: string, phone: string, role: string, passwordHash: string) {
  const { rows } = await pool.query<{ id: string }>(
    `
      INSERT INTO users (email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        phone = EXCLUDED.phone,
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
      RETURNING id
    `,
    [email, phone, passwordHash, role]
  );

  return rows[0]?.id;
}

async function upsertProduct(product: (typeof products)[number]) {
  const existing = await pool.query<{ id: string }>(
    'SELECT id FROM products WHERE name = $1 LIMIT 1',
    [product.name]
  );

  if (existing.rows[0]) {
    const { rows } = await pool.query<{ id: string }>(
      `
        UPDATE products SET
          price = $2,
          description = $3,
          image_url = $4,
          category = $5,
          stock = $6
        WHERE id = $1
        RETURNING id
      `,
      [existing.rows[0].id, product.price, product.description, product.imageUrl, product.category, product.stock]
    );

    return rows[0]?.id;
  }

  const { rows } = await pool.query<{ id: string }>(
    `
      INSERT INTO products (name, price, description, image_url, category, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `,
    [product.name, product.price, product.description, product.imageUrl, product.category, product.stock]
  );

  return rows[0]?.id;
}

async function seed() {
  try {
    const passwordHash = await bcrypt.hash(seedPassword, 10);
    const userIds = new Map<string, string>();
    const productIds: string[] = [];

    for (const user of users) {
      const id = await upsertUser(user.email, user.phone, user.role, passwordHash);
      if (id) userIds.set(user.email, id);
    }

    for (const product of products) {
      const id = await upsertProduct(product);
      if (id) productIds.push(id);
    }

    const customerId = userIds.get('customer@whazzonline.com');
    const buyerId = userIds.get('buyer@whazzonline.com');

    if (customerId && productIds[0] && productIds[1]) {
      await pool.query(
        `
          INSERT INTO reviews (product_id, user_id, rating, comment)
          VALUES
            ($1, $2, 5, 'Excellent sound and battery life.'),
            ($3, $2, 4, 'Reliable watch for daily workouts.')
          ON CONFLICT (product_id, user_id) DO UPDATE SET
            rating = EXCLUDED.rating,
            comment = EXCLUDED.comment
        `,
        [productIds[0], customerId, productIds[1]]
      );
    }

    if (buyerId && productIds[2] && productIds[3]) {
      const existingCart = await pool.query<{ id: string }>(
        "SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1",
        [buyerId]
      );
      const cartId = existingCart.rows[0]?.id ?? (
        await pool.query<{ id: string }>(
          "INSERT INTO carts (user_id, status) VALUES ($1, 'active') RETURNING id",
          [buyerId]
        )
      ).rows[0]?.id;

      if (cartId) {
        await pool.query(
          `
            INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES ($1, $2, 1)
            ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity
          `,
          [cartId, productIds[2]]
        );
      }

      await pool.query(
        `
          INSERT INTO reviews (product_id, user_id, rating, comment)
          VALUES ($1, $2, 5, 'Very comfortable and easy to assemble.')
          ON CONFLICT (product_id, user_id) DO UPDATE SET
            rating = EXCLUDED.rating,
            comment = EXCLUDED.comment
        `,
        [productIds[2], buyerId]
      );

      const existingSeedOrder = await pool.query<{ id: string }>(
        `
          SELECT o.id
          FROM orders o
          JOIN order_items oi ON oi.order_id = o.id
          WHERE o.user_id = $1 AND oi.product_id = $2
          LIMIT 1
        `,
        [buyerId, productIds[3]]
      );

      if (!existingSeedOrder.rows[0]?.id) {
        await pool.query(
          `
            WITH seeded_order AS (
              INSERT INTO orders (user_id, status, total_amount)
              VALUES ($1, 'pending', 88000)
              RETURNING id
            )
            INSERT INTO order_items (order_id, product_id, quantity, unit_price)
            SELECT id, $2, 1, 88000 FROM seeded_order
          `,
          [buyerId, productIds[3]]
        );
      }
    }

    console.log('Seed data inserted.');
    console.log('Admin: admin@whazzonline.app / Test1234!');
    console.log('Vendor: vendor@whazzonline.com / Test1234!');
    console.log('Customer: customer@whazzonline.com / Test1234!');
  } finally {
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('Failed to seed database.');
  console.error(error);
  process.exit(1);
});
