/*
  Reset the due dates to what they would have been before dynamic due dates but
  only where 'due date' is null.
*/

WITH quarter_one AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2025-04-01'
    AND r.end_date <= '2025-06-30'
    AND r.quarterly = TRUE
    AND r.metadata->>'isSummer' = 'false'
    AND r.created_at >= '2025-10-28'
)
UPDATE "returns"."returns" r
SET
  due_date = '2025-07-28'
FROM
  quarter_one q1
WHERE
  r.id = q1.id;

WITH quarter_two AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2025-07-01'
    AND r.end_date <= '2025-09-30'
    AND r.quarterly = TRUE
    AND r.metadata->>'isSummer' = 'false'
    AND r.created_at >= '2025-10-28'
)
UPDATE "returns"."returns" r
SET
  due_date = '2025-10-28'
FROM
  quarter_two q2
WHERE
  r.id = q2.id;

WITH quarter_three AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2025-10-01'
    AND r.end_date <= '2025-12-31'
    AND r.metadata->>'isSummer' = 'false'
    AND r.quarterly = TRUE
)
UPDATE "returns"."returns" r
SET
  due_date = '2026-01-28'
FROM
  quarter_three q3
WHERE
  r.id = q3.id;

WITH quarter_four AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2026-01-01'
    AND r.end_date <= '2026-03-31'
    AND r.metadata->>'isSummer' = 'false'
    AND r.quarterly = TRUE
)
UPDATE "returns"."returns" r
SET
  due_date = '2026-04-28'
FROM
  quarter_four q4
WHERE
  r.id = q4.id;

WITH summer AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2024-11-01'
    AND r.end_date <= '2025-10-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'true'
    AND r.created_at >= '2025-11-03'
)
UPDATE "returns"."returns" r
SET
  due_date = '2025-11-28'
FROM
  summer s
WHERE
  r.id = s.id;

WITH all_year AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.due_date IS NULL
    AND r.start_date >= '2025-04-01'
    AND r.end_date <= '2026-10-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'false'
)
UPDATE "returns"."returns" r
SET
  due_date = '2026-04-28'
FROM
  all_year al
WHERE
  r.id = al.id;
