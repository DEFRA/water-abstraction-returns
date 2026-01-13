/*
  Update the indexes in returns.returns

  https://eaflood.atlassian.net/browse/WATER-5427

  This migration will remove the index from the returns.regime column and add an index to the new returns.id column.
*/

DROP INDEX IF EXISTS "returns".returns_regime;
CREATE UNIQUE INDEX IF NOT EXISTS returns_id ON "returns"."returns" (id);
