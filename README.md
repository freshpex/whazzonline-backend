# Whazzonline Backend

Node.js + Express + TypeScript REST API powering Whazzonline commerce flows.

## Overview

This backend currently supports:

- Authentication (signup/login/me)
- Admin-protected user creation
- Product listing with search, category filter, pagination
- Product details retrieval
- Vendor/Admin product creation
- Product reviews (list + upsert by authenticated user)
- Payment simulation checkout with order creation and stock deduction
- Swagger/OpenAPI docs endpoint

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL (`pg`)
- JWT auth
- Zod validation
- Vitest

## API Base URL

- Local: `http://localhost:4000/api/v1`

## Key Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/users` (admin only)
- `GET /products?q=&category=&page=&limit=`
- `GET /products/categories`
- `GET /products/:id`
- `POST /products` (admin/vendor)
- `GET /products/:id/reviews`
- `POST /products/:id/reviews` (auth)
- `POST /orders/checkout` (auth)
- `GET /health`
- `GET /docs`
- `GET /docs/openapi.json`

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

- `NODE_ENV` (`development|test|production`)
- `PORT` (default `4000`)
- `CLIENT_ORIGIN` (frontend origin(s), comma-separated)
- `JWT_SECRET` (minimum 24 chars)
- `JWT_EXPIRES_IN` (default `7d`)
- `DATABASE_URL` (PostgreSQL connection string)

## Seed Data

```bash
npm run seed
```

Creates sample users, products, reviews, and sample order/cart records.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

Recommended: Render (or Railway)

Required runtime env vars:

- `NODE_ENV=production`
- `PORT`
- `CLIENT_ORIGIN`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DATABASE_URL`

## Known Limitations

- Checkout is a simulation flow (no external processor/webhook integration)
- No order history/read APIs yet for customer/vendor dashboards
- No background job system for async workflows (emails, retries, reconciliation)

## Next Improvements

- Add order history, invoice endpoints, and vendor fulfillment views
- Introduce refresh-token/session rotation model
- Add integration tests for checkout transaction behavior
- Add observability (structured logs, tracing, metrics)
