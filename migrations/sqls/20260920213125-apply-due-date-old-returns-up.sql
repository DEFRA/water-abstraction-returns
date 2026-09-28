/*
  https://eaflood.atlassian.net/browse/WATER-5831

  [Dynamic Due Dates](https://eaflood.atlassian.net/browse/WATER-4991) was released in
  [December 2025](https://eaflood.atlassian.net/projects/WATER/versions/28468). Instead of setting the due date on
  returns at creation to the end of the return cycle plus 28 days, we'd leave it NULL. Instead, we updated the returns
  invitation notice journeys to set it to 29 days after the invitation is confirmed as 'sent'.

  This followed another change in returns: [quarterly returns](https://eaflood.atlassian.net/browse/WATER-4706). These
  came into effect on 1 April 2025, and the first invitations were sent in July 2025.

  Since then, any time a change has been made to a licence's return versions, the service will:

  - `void` any existing return logs in the period affected
  - generate new return logs for the period affected
  - leave the date as 'null' for the new return logs

  The business has realised this makes sense for return logs after 1 April 2025. But when making corrections that change
  older return logs, there is no intent to send out new invites. These are more administrative changes, managed by the
  business. But they give the impression that further action is needed because they have a null 'due date'.

  In [Set due date when creating pre 2025-04-01 returns](https://github.com/DEFRA/water-abstraction-system/pull/3674)
  we've updated the service to apply the due date when generating new return logs.

  But it's been generating old return logs with `null` due dates for some time now. So, alongside the change in
  functionality we need to deal with the existing return logs.

  This change sets the 'due date' of any return with a null 'due date' and an end date before 1 April 2025 to the linked
  return cycle's 'due date'.
*/
WITH old_return_logs AS (
  SELECT
    r.id,
    rc.due_date AS return_cycle_due_date
  FROM
    "returns"."returns" r
  INNER JOIN
    "returns".return_cycles rc
    ON rc.return_cycle_id = r.return_cycle_id
  WHERE
    r.due_date IS NULL
    AND r.end_date < '2025-04-01'
)
UPDATE "returns"."returns" r
SET
  due_date = orl.return_cycle_due_date
FROM
  old_return_logs orl
WHERE
  r.id = orl.id;
