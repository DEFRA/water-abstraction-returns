/*
  Reset the due dates to what they would have been before dynamic due dates but
  only where 'due date' is null.
*/

WITH summer_2025_26 AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2025-11-01'
    AND r.end_date <= '2026-10-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'true'
)
UPDATE "returns"."returns" r
SET
  due_date = '2026-11-28'
FROM
  summer_2025_26 s
WHERE
  r.id = s.id;
