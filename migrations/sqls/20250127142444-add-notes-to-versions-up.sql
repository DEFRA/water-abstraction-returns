/*
  Adds columns to allow us to capture a note and who created the version

  We capture the user_id so we can link to the idm.users record of the user who created the return version and
  accompanying records
*/

BEGIN;

ALTER TABLE returns.versions
  ADD COLUMN notes text,
  ADD COLUMN created_by integer;

COMMIT;
