/*
  Fix corrupt return logs for a licence

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
*/

UPDATE "returns"."returns" r SET "status" = 'completed', received_date = '2024/05/03' WHERE r.return_id = 'v1:2:03/28/73/0013:10025122:2023-04-01:2024-03-31';

UPDATE "returns"."returns" r SET "status" = 'due', received_date = null WHERE r.return_id = 'v1:2:03/28/73/0013:10064889:2025-04-01:2026-03-31';

DELETE FROM "returns".lines l WHERE l.version_id IN (
  SELECT v.version_id FROM "returns".versions v WHERE v.return_id = 'v1:2:03/28/73/0013:10064890:2024-11-01:2025-10-31'
);

DELETE FROM "returns".versions v WHERE v.return_id = 'v1:2:03/28/73/0013:10064890:2024-11-01:2025-10-31';
