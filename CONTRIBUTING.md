# Backend Contribution Guide

## Branching Convention

Create branches from `dev`:

```txt
users/<name>/<feature|bugfix|hotfix|chore|docs|refactor|test>/<description>
```

Example:

```txt
users/enoch/feature/reviews-and-checkout-endpoints
```

## Workflow

1. Pull latest `dev`.
2. Create your branch.
3. Implement in small, reviewable commits.
4. Run quality checks locally.
5. Open PR into `dev` with context and evidence.

## Commit Style

Use conventional-style commits:

- `feat: add checkout simulation endpoint`
- `fix: validate product list pagination query`
- `test: update product controller pagination assertions`
- `docs: refresh backend architecture and setup`

## PR Requirements

Every PR should include:

- Scope summary and rationale
- API contract impact (if any)
- Test evidence (`npm run test`, `npm run build`)
- Migration/env changes if applicable
- Risk notes and fallback/rollback considerations

## Must-Pass Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Backend Standards

- Validate all external input with Zod
- Keep route/controller/service/repository separation
- Return consistent API response envelope (`{ success, data }` or error message)
- Enforce role and auth checks at route/middleware boundaries
- Keep DB mutations atomic for transactional flows (checkout/order writes)

## Review Focus Areas

Reviewers should prioritize:

- Data integrity and transaction safety
- Auth/authorization correctness
- Backward compatibility and endpoint consistency
- Failure mode clarity (error messages/status codes)
- Test coverage for new behavior
