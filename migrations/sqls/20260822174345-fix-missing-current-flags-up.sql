/*
  https://eaflood.atlassian.net/browse/WATER-5776

  Back in June 2025, WRLS took over management of returns from NALD. Part of this was the migration of all the historic
  return submissions that NALD had, but WRLS didn't.

  To account for corrections, you can submit a return submission multiple times. Each 'version' is recorded in the
  `returns.versions` table. There is a version number, so you can work out which is the latest. But there is also a
  `current` flag, which is true for the latest 'version'.

  Or it is in most cases, but not the ones we imported. We must have missed setting this flag when we imported the
  historic return submissions from NALD.

  This data fix migration finds those missing the flag and sets it. It also updates the `updated_at` timestamp to the
  current time so that RDP, which depends on the timestamp to determine which records need to be re-synced, will see the
  change.
*/
WITH latest_versions AS (
  SELECT DISTINCT ON (return_log_id)
    v.version_id,
    v.return_log_id,
    v.version_number,
    v."current",
    v.user_id,
    v.user_type,
    v.created_at,
    v.updated_at
  FROM
    "returns".versions v
  ORDER BY
    v.return_log_id,
    v.version_number DESC
)
UPDATE "returns".versions v
SET
  "current" = true,
  updated_at = now()
FROM
  latest_versions lv
WHERE
  v.version_id = lv.version_id
  AND v."current" = false;
