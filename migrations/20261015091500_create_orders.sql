-- migrate:up

CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id int NOT NULL REFERENCES users(id),
  items jsonb NOT NULL,
  total numeric(10, 2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- migrate:down

DROP TABLE orders;