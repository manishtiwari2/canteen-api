-- migrate:up
CREATE UNIQUE INDEX users_email_key ON users (email);
-- migrate:down
DROP INDEX users_email_key;