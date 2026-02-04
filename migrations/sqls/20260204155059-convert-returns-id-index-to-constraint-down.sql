
BEGIN TRANSACTION;

-- Drop the constraint we created. However, when we added the constraint and said use the existing index, the constraint
-- took ownership of the index, so dropping the constraint also drops the index.
-- Essentially, PostgreSQL sees the unique index as an implementation detail when constraints are created, hence the
-- index is owned by the constraint and not intended for direct usage.
ALTER TABLE "returns"."returns" DROP CONSTRAINT IF EXISTS unique_returns_id;

-- Because the index was dropped, we have to recreate it here.
CREATE UNIQUE INDEX IF NOT EXISTS returns_id ON "returns"."returns" (id);

COMMIT;
