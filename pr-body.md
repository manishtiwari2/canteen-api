## Evidence record
Observable change : POST /users with an existing email returned 201 and created a second user
Root cause : src/users/routes.js INSERT; users.email had no unique index
Failing commit : 3f9a1c2 (test(users): cover duplicate email signup) - CI red
Passing commit : 8b41d07 (fix(users): return 409 for a duplicate email) - CI green
Tests covering it : tests/integration/users.test.js > rejects a duplicate email during signup