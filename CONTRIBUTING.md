# Contribution Guide

## Workflow

1. Pull the latest `dev` branch.
2. Create your branch from `dev`.
3. Use the branch format: `users/<name>/<type>/<description>`.
4. Make small commits with clear messages.
5. Run `npm run check` before pushing.
6. Open a pull request into `dev`.

## Commit Standard

Use clear conventional-style commits:

- `feat: add product listing endpoint`
- `fix: handle missing product id`
- `chore: update CI workflow`
- `docs: improve setup guide`

## Pull Request Rules

A PR must include:

- What changed
- Why it changed
- Screenshots or API samples where useful
- Test evidence
- Known limitations

No PR will be merged if linting, type checking, tests, or build fails.
