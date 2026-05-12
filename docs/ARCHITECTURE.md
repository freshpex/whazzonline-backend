# Backend Architecture

The backend is organized by API version and business module. Shared concerns such as config, auth, database, errors, middleware, and utilities live in `src/shared`.

Each module owns its controllers, routes, services, validators, tests, and types. This keeps the codebase easy to scale as Whazzonline grows from a mini commerce product into a broader platform.

## Why This Structure

- Clear module ownership
- Versioned APIs for future compatibility
- Easier testing and onboarding
- Lower risk of unrelated modules breaking each other
