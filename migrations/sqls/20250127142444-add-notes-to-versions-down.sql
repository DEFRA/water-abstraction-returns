/* revert changes made */

BEGIN;

ALTER TABLE returns.versions
  DROP COLUMN notes,
  DROP COLUMN created_by;

COMMIT;
