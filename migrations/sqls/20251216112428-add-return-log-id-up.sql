/*
  Adds and populates a new return_log_id UUID field to the table returns.versions

  https://eaflood.atlassian.net/browse/WATER-5425

  This migration will add a new return_log_id UUID field to the table returns.versions. It will then populate this field
  with the corresponding id from the returns.returns table based on the return_id foreign key.
*/

BEGIN;
  -- Add the column without NOT NULL constraint first
  ALTER TABLE "returns".versions ADD COLUMN return_log_id UUID;

  -- Populate the column with data from returns table
  UPDATE "returns".versions v
  SET return_log_id = r.id
  FROM "returns"."returns" r
  WHERE v.return_id = r.return_id;

  -- Now add the NOT NULL constraint after data is populated. All rows should have a valid return_log_id now.
  ALTER TABLE "returns".versions ALTER COLUMN return_log_id SET NOT NULL;
COMMIT;
