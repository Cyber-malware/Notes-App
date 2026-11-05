CREATE TABLE IF NOT EXISTS vault_entries (
 path text PRIMARY KEY,
 folder boolean NOT NULL DEFAULT false,
 data bytea,
 version text,
 updated timestamptz NOT NULL DEFAULT now(),
 CHECK ((folder AND data IS NULL) OR (NOT folder AND data IS NOT NULL AND version IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS login_attempts (
 key text PRIMARY KEY,
 count integer NOT NULL,
 started timestamptz NOT NULL
);
