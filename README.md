# Whazzonline Backend

Node.js + Express.js + TypeScript API for the Whazzonline mini e-commerce assessment.

## Architecture

```txt
src/
  shared/
    auth/
    config/
    db/
    errors/
    middleware/
    utils/
  v1/
    modules/
      admin/
      auth/
      cart/
      health/
      me/
      products/
      users/
        controllers/
        routes/
        services/
        tests/
        validators/
```

## Local Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Seed Data

Run:

```bash
npm run seed
```

This seeds users, products, reviews, sample cart items, and a sample order.
Default seeded credentials:

- `admin@whazzonline.com / Password123!`
- `vendor@whazzonline.com / Password123!`
- `customer@whazzonline.com / Password123!`

## Swagger Docs

When the API is running, open:

- `/api/v1/docs`
- `/api/v1/docs/openapi.json`

## Required Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Branching Standard

Create branches from `dev` only:

```txt
users/<name>/<feature|bugfix|hotfix|chore|docs|refactor|test>/<description>
```

Example:

```txt
users/enoch/feature/product-listing-api
```

Direct push to `main` and `dev` is blocked by Husky locally. GitHub branch protection should also require pull requests and passing CI before merge.

## Deployment

Recommended backend deployment: Render.

Set these environment variables on Render:

- `NODE_ENV=production`
- `PORT`
- `CLIENT_ORIGIN`
- `JWT_SECRET`
- `DATABASE_URL`

## Known Limitations

We currently use in-memory product data. Will replace with PostgreSQL when persistence is required.
