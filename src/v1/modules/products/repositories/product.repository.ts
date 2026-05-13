import { pool } from '../../../../shared/db/pool.js';
import type { Product, ProductCreateInput } from '../types/product.types.js';

const DEFAULT_LIMIT = 100;

export async function listProducts(query?: string, category?: string, limit = DEFAULT_LIMIT): Promise<Product[]> {
  const values: Array<string | number> = [];
  const conditions: string[] = [];

  if (query) {
    values.push(`%${query}%`);
    const index = values.length;
    conditions.push(`(name ILIKE $${index} OR description ILIKE $${index})`);
  }

  if (category) {
    values.push(category);
    const index = values.length;
    conditions.push(`category ILIKE $${index}`);
  }

  const boundedLimit = Math.max(1, Math.min(limit, DEFAULT_LIMIT));
  values.push(boundedLimit);
  const limitIndex = values.length;

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT
      id,
      name,
      price,
      description,
      image_url AS "imageUrl",
      category,
      stock
    FROM products
    ${whereClause}
    ORDER BY name ASC
    LIMIT $${limitIndex}
  `;

  const { rows } = await pool.query<Product>(sql, values);
  return rows;
}

export async function findProductById(id: string): Promise<Product | null> {
  const sql = `
    SELECT
      id,
      name,
      price,
      description,
      image_url AS "imageUrl",
      category,
      stock
    FROM products
    WHERE id = $1
  `;

  const { rows } = await pool.query<Product>(sql, [id]);
  return rows[0] ?? null;
}

export async function createProduct(input: ProductCreateInput): Promise<Product> {
  const sql = `
    INSERT INTO products (name, price, description, image_url, category, stock)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      name,
      price,
      description,
      image_url AS "imageUrl",
      category,
      stock
  `;

  const values = [
    input.name,
    input.price,
    input.description,
    input.imageUrl,
    input.category,
    input.stock
  ];

  const { rows } = await pool.query<Product>(sql, values);
  const created = rows[0];
  if (!created) {
    throw new Error('Failed to create product');
  }
  return created;
}
