# Backend Architecture

## Architectural Style

The backend uses a versioned modular architecture with clear layers:

- `routes`: endpoint mapping and middleware composition
- `controllers`: request/response orchestration
- `services`: domain/business logic
- `repositories`: database access and SQL
- `validators`: Zod schemas for input validation
- `types`: module-local contracts

Shared concerns are centralized under `src/shared` (auth, db, config, errors, middleware).

## Directory Layout

```txt
src/
  shared/
    auth/
    config/
    db/
    errors/
    middleware/
    types/
  v1/
    modules/
      auth/
      docs/
      health/
      orders/
      products/
    routes.ts
```

## Request Lifecycle

1. Request enters `v1` route namespace (`/api/v1`)
2. Middleware handles security/cors/auth where required
3. Controller validates input and delegates to service
4. Service coordinates domain rules and repository calls
5. Repository performs SQL against PostgreSQL
6. Structured success/error response exits through global handlers

## Core Domain Modules

### `auth`

- Signup/login JWT issuance
- Current user lookup (`/auth/me`)
- Admin user provisioning (`/auth/users`)

### `products`

- Search + filter + paginated listing
- Product retrieval by ID
- Vendor/Admin product creation
- Reviews read and authenticated upsert

### `orders`

- Checkout simulation endpoint
- Transactional order creation
- Inventory validation and stock deduction

## Security & Validation

- JWT-based stateless auth
- Role enforcement via middleware (`require-admin`, `require-product-manager`)
- Zod schema validation on all mutable endpoints
- Centralized error handling with HTTP-safe messages

## Scalability Notes

This structure is ready to support:

- Additional modules (payments, fulfillment, notifications)
- API version evolution (`v2` routes) without breaking existing clients
- Event-driven extensions for async processes
- Expanded automated testing layers (integration/e2e)
