/* Drop the new returns_id index and put the old returns_regime index back */

DROP INDEX IF EXISTS "returns".returns_id;
CREATE INDEX IF NOT EXISTS returns_regime ON "returns"."returns" (regime);
