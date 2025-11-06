/*
  https://eaflood.atlassian.net/browse/WATER-5373

  When the Billing & Data team started checking the recipients that would be selected for the next round of return
  invitations, they spotted that there were some missing (when compared to a report they ran).

  When they looked, they were all linked to licences that had return versions with a reason of 'Succession or transfer
  of licence'.

  When this is the reason against the return version, the return logs we generate from it have the flag `isCurrent`,
  found in their `metadata` field, set to 'false'.

  When we did this, we didn't know why, and it was what we thought the legacy code was doing. Another thing we copied
  was their query for selecting which return logs to base a returns invitation on. Their query excluded return logs
  where `isCurrent = false`, so we did the same.

  This meant these return logs would be excluded when generating return invitations and reminders. So, when the query
  came in, we concluded that the filter was incorrect.

  The invites got generated and sent out. We then received a call from a customer stating that they'd visited the
  external site but could not find a return log to submit. When we looked, we found that the [legacy UI
  code](https://github.com/DEFRA/water-abstraction-ui) was using the same `isCurrent=true` filter whenever fetching
  return logs to display. This code has been in place for the last 7 years, so we began to question whether the filter
  was really the issue.

  We went back to the old [water-abstraction-import](https://github.com/DEFRA/water-abstraction-import) code, before we
  deleted it, and that was when we spotted our misinterpretation of how the flag was being set.

  **Legacy vs System**

  The process for return logs is _entirely_ different for the two apps.

  In the legacy app (water-abstraction-import), each night, it would review the whole history of a licence, including
  its return and licence versions. From that, it would generate the return logs it believed should exist.

  It would then attempt to 'insert' those new records. When this clashed because the record already existed, it would
  'update' instead.

  Anything not inserted or updated was considered invalid and marked as `VOID`.

  In the system app, we only look at a _point in time_ onwards. This might be because a licence has ended, or a new
  return version added, or when the annual jobs kick off. We refer to this as the 'change date'. Our process is then the
  same as the legacy; we generate the return logs, attempt to insert them, update where they already exist, and `VOID`
  anything not touched.

  **The legacy 'split date'**

  In the legacy app, for each licence, it would get a value it referred to as the 'split date'. This is the effective
  start date of the latest return version, provided the reason code was `SUCC` (succession or transfer).

  So, for most licences, this is NULL, and all their generated return logs will have `isCurrent=true`.

  Where it isn't, when generating the return logs, it asks, “Is the start date before the split date?” Because it is
  working through the whole history of the licence, there will be instances where this is the case, which means
  `isCurrent=false` is applied to the generated return log. Once it moves past that date, it becomes `isCurrent=true`
  again.

  **The system interpretation**

  In system, because of the different way it works, this got mistakenly interpreted as `if reason is 'SUCC' then
  isCurrent = false`. So, we're applying it to all return logs linked to a return version with this reason code.

  Hence the confusion; external users can see the return logs before the new return version because they are
  `isCurrent=true`. But they can't see the new ones because they are `isCurrent=false`.

  **The 'right' interpretation**

  A licence being transferred in NALD does not automatically mean the old licensee stops seeing it in the external site,
  and the new one starts seeing it. The licence has to be manually de-linked and re-registered.

  Once this is done and the new return version is added with a reason of `SUCC`, we need to prevent the new licensee
  from seeing and submitting any old return logs.

  `isCurrent` is essentially a sledgehammer to crack this nut: if we mark all return logs before the 'succession date'
  (split date in legacy terms) as `isCurrent=false`, we stop showing them in the UI. It's a known issue that the old
  licensee also loses access to them, but that's a problem for another day.

  **The fix**

  [Fix return log isCurrent setting and handling](https://github.com/DEFRA/water-abstraction-system/pull/2612) has
  corrected how we set the flag in return logs when new return versions are added.

  This change is about correcting those that have already been created, but their `isCurrent` is wrong. We apply the
  same logic as the legacy import. Identify the 'split-date' for each licence and, where applicable, set
  `isCurrent=false` on all return logs for that licence that start _before_ the split-log date.

  We then ensure those return logs that start _after_ this date get the flag correctly set to `isCurrent=true`.

  We're only touching those where the flag is incorrect, and we're updating their `updated_at` so we know which ones we
  updated.

  Note - We have to wrap the query in an anonymous code block because we depend on a table in another schema but when
  this is run in CI that schema does not exist.
*/

DO $$
BEGIN
  IF EXISTS
    (
      SELECT
        1
      FROM
        information_schema.tables
      WHERE
        table_schema = 'water'
        AND table_name = 'return_versions'
    )
  THEN
    UPDATE "returns"."returns" r
    SET
      updated_at = NOW(),
      metadata = jsonb_set(metadata, '{isCurrent}', 'false')
    FROM (
      SELECT DISTINCT ON (rv.licence_id)
        l.licence_ref,
        rv.start_date AS latest_start_date
      FROM
        water.return_versions rv
      INNER JOIN water.licences l
        ON l.licence_id = rv.licence_id
      WHERE
        rv.reason = 'succession-or-transfer-of-licence'
      ORDER BY rv.licence_id, rv.start_date DESC
    ) latest
    WHERE
      r.licence_ref = latest.licence_ref
      AND r.start_date < latest.latest_start_date
      AND r.metadata->>'isCurrent' = 'true';

    UPDATE "returns"."returns" r
    SET
      updated_at = NOW(),
      metadata = jsonb_set(metadata, '{isCurrent}', 'true')
    FROM (
      SELECT DISTINCT ON (rv.licence_id)
        l.licence_ref,
        rv.start_date AS latest_start_date
      FROM
        water.return_versions rv
      INNER JOIN water.licences l
        ON l.licence_id = rv.licence_id
      WHERE
        rv.reason = 'succession-or-transfer-of-licence'
      ORDER BY rv.licence_id, rv.start_date DESC
    ) latest
    WHERE
      r.licence_ref = latest.licence_ref
      AND r.start_date >= latest.latest_start_date
      AND r.metadata->>'isCurrent' = 'false';
  END IF;
END
$$;
