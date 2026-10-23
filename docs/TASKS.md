# TASKS (ordered; tick when done)
- [ ] 1. Config and dependencies - done when: npm ci works and .env.example lists every variable
- [ ] 2. Validation + unit tests - done when: npm test is green with boundary tests
- [ ] 3. Dockerfile - done when: curl 127.0.0.1:3000/health returns ok from a container
- [ ] 4. Compose with Postgres - done when: docker compose up shows db healthy
- [ ] 5. Migration runner + first tables - done when: npm run migrate:status shows both applied
- [ ] 6. Users and orders API - done when: integration tests pass (depends on 4, 5)
- [ ] 7. CI workflow - done when: the PR shows a green check (depends on 2, 6)