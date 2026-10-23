# SPEC: canteen-api v1
## Goals
- A student can sign up with email, name and password.
- A signed-up student can place an order of menu items and read it back.
## Constraints
- Node.js 24, Express, PostgreSQL 16. Runs locally with `docker compose up`.
- Config only from environment variables. No secrets in the repo.
- Every schema change is a reviewed migration file.
## Acceptance criteria
- POST /users: 201 on success; 400 for a bad email or a password shorter than 8; 409 for an email already used.
- POST /orders: 201 with the total; 400 if any item has quantity below 1.
- GET /orders/:id: 200 with the order, 404 if it does not exist.
- CI is green on every PR: lint, unit, integration, migration tests, Docker build.
## Out of scope
- Payments, login sessions, a web UI.