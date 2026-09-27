/*
  https://eaflood.atlassian.net/browse/WATER-5842

  **Context**

  Older NALD return requirements allowed a wider range of reporting frequencies. The reporting frequency determines how
  often a licensee must report their abstraction.

  > This is separate from collection frequency. For “reasons” we might require someone to collect the abstraction
  > volumes daily, but report them to us monthly.

  New WRLS return requirements support only monthly, weekly, or daily reporting. But NALD supported yearly, quarterly,
  and fortnightly reporting.

  WRLS return logs can only support monthly, weekly or daily, so if someone makes a change that results in us generating
  a return log from one of these older, imported return requirements, we have to convert it.

  **The issue**

  We've spotted return logs that have a reporting frequency of quarter and year. The service's UI isn't built to support
  these, let alone submit them.

  These were mistakenly created as part of previous fixes for the 'NALD > WRLS' issue. Those fixes took the return
  requirement reporting frequency as-is, without first converting it to 'monthly'.

  **The fix**

  This  migration updates the return logs with either a `yearly' or `quarterly' reporting frequency to 'monthly', as
  well as correcting any associated return submission lines.

  The lines have been checked in the environment we care about (production) and all are monthly, because that is what
  the engine defaults to when it a return requirement is not fortnightly, weekly or daily.
 */

UPDATE "returns".lines l
SET
  time_period = 'month',
  updated_at = NOW()
WHERE
  l.time_period IN ('quarter', 'year');

UPDATE "returns"."returns" r
SET
  returns_frequency = 'month',
  updated_at = NOW()
WHERE
  r.returns_frequency IN ('quarter', 'year');
