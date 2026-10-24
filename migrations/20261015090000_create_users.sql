-- migrate:up

CREATE TABLE users (
  id serial PRIMARY KEY,
  email text NOT NULL,
  user_name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- migrate:down

DROP TABLE users;