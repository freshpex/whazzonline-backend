import { pool } from '../../../../shared/db/pool.js';
import { HttpError } from '../../../../shared/errors/http-error.js';
import type { PaginatedProducts, Product, ProductCreateInput, ProductReview } from '../types/product.types.js';

type ListProductsOptions = {
  query?: string;
  category?: string;
  page: number;
  limit: number;
};

const MAX_LIMIT = 30;

function buildFilterClause(query?: string, category?: string) {
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

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { values, whereClause };
}

export async function listProducts(options: ListProductsOptions): Promise<PaginatedProducts> {
  const { query, category, page, limit } = options;
  const boundedLimit = Math.max(1, Math.min(limit, MAX_LIMIT));
  const { values: baseValues, whereClause } = buildFilterClause(query, category);

  const countResult = await pool.query<{ total: string }>(
    `SELECT COUNT(*)::text AS total FROM products ${whereClause}`,
    baseValues
  );

  const total = Number(countResult.rows[0]?.total ?? '0');
  const totalPages = Math.max(1, Math.ceil(total / boundedLimit));
  const safePage = Math.min(page, totalPages);
  const safeOffset = (safePage - 1) * boundedLimit;

  const values = [...baseValues, boundedLimit, safeOffset];
  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

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
    ORDER BY created_at DESC, name ASC
    LIMIT $${limitIndex}
    OFFSET $${offsetIndex}
  `;

  const { rows } = await pool.query<Product>(sql, values);
  return {
    items: rows,
    page: safePage,
    limit: boundedLimit,
    total,
    totalPages
  };
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

  const values = [input.name, input.price, input.description, input.imageUrl, input.category, input.stock];

  const { rows } = await pool.query<Product>(sql, values);
  const created = rows[0];
  if (!created) throw new Error('Failed to create product');
  return created;
}

export async function listProductReviews(productId: string): Promise<ProductReview[]> {
  const sql = `
    SELECT
      r.id,
      r.product_id AS "productId",
      r.user_id AS "userId",
      r.rating,
      r.comment,
      r.created_at AS "createdAt",
      COALESCE(u.email, u.phone, 'Anonymous buyer') AS reviewer
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `;

  const { rows } = await pool.query<ProductReview>(sql, [productId]);
  return rows;
}

export async function createOrUpdateProductReview(params: {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}): Promise<ProductReview> {
  const sql = `
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (product_id, user_id)
    DO UPDATE SET
      rating = EXCLUDED.rating,
      comment = EXCLUDED.comment,
      created_at = NOW()
    RETURNING
      id,
      product_id AS "productId",
      user_id AS "userId",
      rating,
      comment,
      created_at AS "createdAt"
  `;

  const { rows } = await pool.query<Omit<ProductReview, 'reviewer'>>(sql, [
    params.productId,
    params.userId,
    params.rating,
    params.comment ?? null
  ]);

  const review = rows[0];
  if (!review) {
    throw new Error('Failed to create review');
  }

  const reviewerResult = await pool.query<{ reviewer: string }>(
    `SELECT COALESCE(email, phone, 'Anonymous buyer') AS reviewer FROM users WHERE id = $1`,
    [params.userId]
  );

  return {
    ...review,
    reviewer: reviewerResult.rows[0]?.reviewer ?? 'Anonymous buyer'
  };
}

export async function ensureProductExists(productId: string) {
  const exists = await pool.query<{ id: string }>('SELECT id FROM products WHERE id = $1 LIMIT 1', [productId]);
  if (!exists.rows[0]) {
    throw new HttpError(404, 'We could not find that product.');
  }
}

export async function listProductCategories(): Promise<string[]> {
  const { rows } = await pool.query<{ category: string }>(
    `
      SELECT DISTINCT category
      FROM products
      WHERE category IS NOT NULL AND category <> ''
      ORDER BY category ASC
    `
  );
  return rows.map((row) => row.category);
}
