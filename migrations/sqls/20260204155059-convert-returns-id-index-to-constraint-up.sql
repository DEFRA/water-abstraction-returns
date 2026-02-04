/*
  Convert returns.id unique index to a constraint

  https://eaflood.atlassian.net/browse/WATER-5427

  In a previous migration we added a unique index to `returns.returns` for a new `id` column that we had added with the
  intention of using it as the 'unique identifier' going forward. We'd forgotten to add it at the time!

  We had another legacy table we want to add a proper UUID to, but this time we remembered to add it!

  Only the way it was added differed to how it was done here.

  ```sql
  CREATE UNIQUE INDEX IF NOT EXISTS returns_id ON "returns"."returns" (id);

  -- vs

  ALTER TABLE idm.users ADD CONSTRAINT unique_users_id UNIQUE (id);
  ```

  We asked ChatGPT what the differences were between a unique index and a unique constraint, and it helpfully explained
  that a unique constraint is a higher-level concept that enforces uniqueness at the table level, while a unique index
  is a lower-level implementation detail that supports the enforcement of uniqueness.

  TL;DR; We should have added a unique constraint rather than a unique index!

  However, because a constraint uses a unique index under the hood to enforce uniqueness, we can tell PostgreSQL to use
  our existing index in a new constraint which avoids the need to rebuild it.

  So, this change converts our unique index into a unique constraint.
*/

ALTER TABLE "returns"."returns" ADD CONSTRAINT unique_returns_id UNIQUE USING INDEX returns_id;
