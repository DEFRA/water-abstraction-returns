/*
  Fix corrupt return log for a licence pt2

  https://eaflood.atlassian.net/browse/WATER-5137

  The business reported that when viewing the return logs for a licence, the UI was not making sense.

  One was showing as received when it is not actually due yet. Another was showing as 'due' in November, but when you
  click into it, there is submission data.

  They were correct that the data was incorrect for these return logs. The source of the confusion was multiple NALD
  return logs for the same period. This is not a scenario the import was designed to handle, and from discussions, it
  appears to be an exception in NALD.

  This means the import has pulled data from multiple sources when trying to set up the single return log in WRLS.

  The returns import is now disabled as WRLS has taken over management of all returns from NALD. So, the only solution
  is a data fix migration for this licence.

  We thought we had nailed this with [Fix corrupt return logs for a
  licence](https://github.com/DEFRA/water-abstraction-returns/pull/430). But we'd overlooked the implications of running
  [Data fix submitted rtn logs missing received date](https://github.com/DEFRA/water-abstraction-returns/pull/429).

  It's script will see the return submission, and no `received_date` against the return log. So it sets the status to
  `completed` and the `received_date`.

  Then our fix for corrupt logs comes along and deletes the errant return submission. Knowing now it comes after, it
  also needs to reset the status to `due` and the received date to 'null'.
*/

UPDATE "returns"."returns" r SET "status" = 'due', received_date = null WHERE r.return_id = 'v1:2:03/28/73/0013:10064890:2024-11-01:2025-10-31';
