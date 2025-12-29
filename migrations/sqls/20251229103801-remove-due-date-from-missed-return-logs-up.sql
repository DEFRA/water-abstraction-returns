/*
  https://eaflood.atlassian.net/browse/WATER-5429

  In Add migration to remove due date from return logs, we added a migration script to remove the due date from certain
  return logs.

  This was to support the switch to dynamic due dates.

  When agreeing on which return logs to remove the due date from, we were focused on the recent and current periods. At
  the time, the 2025-26 winter and all-year return logs had been generated, so this was the last period we considered.

  However, by the time the migration was run, we'd also generated the 2025-26 summer return logs. This means these were
  missed, so now those return logs still have a 'due date'.
*/

WITH summer_2025_26 AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.status = 'due'
    AND r.start_date >= '2025-11-01'
    AND r.end_date <= '2026-10-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'true'
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
FROM
  summer_2025_26 s
WHERE
  r.id = s.id;
