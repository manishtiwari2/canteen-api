# AGENTS.md
## Project
canteen-api: a small REST API for ordering food from the campus canteen. Node.js 24 + Express + PostgreSQL 16.
## Commands
- Install: `npm ci`
- Lint: `npm run lint`
- Unit tests: `npm test`
- Integration + migration tests: `npm run test:integration` (needs `docker compose up -d db`)
- Run locally: `docker compose up --build` (app on 127.0.0.1:3000, Postgres on 127.0.0.1:5432)
- Migrations: `npm run migrate`, `npm run migrate:down`, `npm run migrate:status`
## Directory map
- src/users - signup, validation
- src/orders - orders and prices
- migrations - SQL migrations, named YYYYMMDDHHMMSS_name.sql, each with -- migrate:up / -- migrate:down
- tests/unit, tests/integration, tests/migrations
## Conventions
- Commits: type(scope): imperative subject (feat, fix, test, docs, refactor, chore, perf)
- Branches: feature/ fix/ refactor/ docs/ chore/
- All config is read from process.env; add every new variable to .env.example
## Rules
- Never edit a migration that is already on main. Write a new one.
- Never read .env, *.pem or *.key files.
- Modules talk through their exported functions only: orders must not query the users table directly.