/*
  Fix return logs updated_at timestamp

  https://eaflood.atlassian.net/browse/WATER-5256

  The business reported that the return logs updated_at timestamp was not being updated when a return was submitted.

  The bug has now been fixed, but we are left with some return log records that have an incorrect updated_at timestamp.

  This migration will fix this issue by updating the return logs updated_at timestamp to match the created_at timestamp
  of the current version of the return log, but only if the updated_at timestamp is earlier than the created_at
  timestamp of the current version. This will prevent legitimate updated_at timestamps from being overwritten.
*/

WITH current_returns AS (
	SELECT v.return_id, v.created_at
	FROM "returns".versions v
	WHERE v."current" = true
)
UPDATE "returns"."returns" r
SET updated_at = cr.created_at
FROM current_returns cr
WHERE r.return_id = cr.return_id
AND r.updated_at < cr.created_at;
