/*
  https://eaflood.atlassian.net/browse/WATER-5284

  This change is part of switching to dynamic due dates.

  All return logs are linked to 'return cycles'. This is a window defined by the internal team that determines when a
  return log should be submitted.

  **Winter and all year** runs April 1 to March 31, **summer** from November 1 to October 31. The 'return period' for a
  return log can differ, but they will always fall within one of these windows.

  Return logs have a 'due date' field, and historically this was set when the return log was created to 28 days after
  the cycle ends; April 28 and November 28.

  > This has been complicated by the introduction of quarterly returns this year, but the principle is the same for
  > these. The 'due date' is set when the return log is created, 28 days after the period ends. For example, quarter 1
  > runs from April 1 to June 30, so the due date would be 28 July.

  However, officially licensees have until 28 days _after_ we notify them. So, even though the internal team try to send
  returns invitations (the notification to licensees they need to submit their return logs) as close to April 1 and
  November 1, though it is not always possible.

  Changes after the returns invitation has been sent also mean we may never have sent a notification for a return log.
  So, we can't really say a return log was submitted late if it was received _after_ the due date.

  Because of this, we have been working on switching to dynamic due dates. When enabled, 'due date' will no longer be
  set in the return log at creation. Only once an invite has been sent, and we have received confirmation from
  [Notify](https://www.notifications.service.gov.uk/), will we set the 'due date' in the return logs. And it will be
  based on the date the notification was sent, not when the return cycle ends.

  This migration handles the existing 'due' return logs. We're not going to wipe the 'due date' from all existing due
  return logs. Instead, we are just going to look at returns logs starting on 1 April 2025.

  We then break it down by period. In essence, for the periods that have passed and invitations were sent for, we are
  only going to update return logs created _after_ their respective returns invite were sent.
*/

WITH quarter_one AS (
  SELECT
    r.id
  FROM
    "returns"."returns" r
  WHERE
    r.status = 'due'
    AND r.start_date >= '2025-04-01'
    AND r.end_date <= '2025-06-30'
    AND r.quarterly = TRUE
    AND r.metadata->>'isSummer' = 'false'
    AND r.created_at >= '2025-10-28'
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
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
    r.status = 'due'
    AND r.start_date >= '2025-07-01'
    AND r.end_date <= '2025-09-30'
    AND r.quarterly = TRUE
    AND r.metadata->>'isSummer' = 'false'
    AND r.created_at >= '2025-10-28'
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
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
    r.status = 'due'
    AND r.start_date >= '2025-10-01'
    AND r.end_date <= '2025-12-31'
    AND r.metadata->>'isSummer' = 'false'
    AND r.quarterly = TRUE
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
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
    r.status = 'due'
    AND r.start_date >= '2026-01-01'
    AND r.end_date <= '2026-03-31'
    AND r.metadata->>'isSummer' = 'false'
    AND r.quarterly = TRUE
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
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
    r.status = 'due'
    AND r.start_date >= '2024-11-01'
    AND r.end_date <= '2025-10-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'true'
    AND r.created_at >= '2025-11-03'
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
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
    r.status = 'due'
    AND r.start_date >= '2025-04-01'
    AND r.end_date <= '2026-03-31'
    AND r.quarterly = FALSE
    AND r.metadata->>'isSummer' = 'false'
)
UPDATE "returns"."returns" r
SET
  due_date = NULL
FROM
  all_year al
WHERE
  r.id = al.id;
