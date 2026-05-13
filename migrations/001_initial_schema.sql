-- Initial schema for Whazzonline

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email TEXT UNIQUE,
	phone TEXT UNIQUE,
	password_hash TEXT NOT NULL,
	role TEXT NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT users_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS products (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	price INTEGER NOT NULL CHECK (price >= 0),
	description TEXT NOT NULL,
	image_url TEXT NOT NULL,
	category TEXT NOT NULL,
	stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS carts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	status TEXT NOT NULL DEFAULT 'pending',
	total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
	product_id UUID NOT NULL REFERENCES products(id),
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
	comment TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (product_id, user_id)
);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
	BEFORE UPDATE ON users
	FOR EACH ROW
	EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER products_updated_at
	BEFORE UPDATE ON products
	FOR EACH ROW
	EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER carts_updated_at
	BEFORE UPDATE ON carts
	FOR EACH ROW
	EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER orders_updated_at
	BEFORE UPDATE ON orders
	FOR EACH ROW
	EXECUTE PROCEDURE set_updated_at();
