/*
  Fix return logs that end after their return vers.

  https://eaflood.atlassian.net/browse/WATER-5356

  Any issue was reported with our return version setup engine (see [Void return logs even if no requirements
  present](https://github.com/DEFRA/water-abstraction-system/pull/2479) for details).

  If the return version added changed the cycle (summer to winter or winter to summer) during a period when return logs
  exist, it didn't `VOID` them.

  We've fixed it, but a licence was left with return logs that needed to be voided.

  We also wanted to check if this affected any other return logs.

  So, we ran a query looking for return logs whose end date was greater than the end date of the return version they
  were linked to.

  We found just three others, but they are older return logs linked to imported return versions.

  We've gone through all the return logs and identified what 'fix' needs to be applied to each.
*/

-- These return logs we just need to set their status to 'void'
UPDATE "returns"."returns"
SET
  "status" = 'void'
WHERE
  return_id IN (
    'v1:2:03/28/63/0003:10024757:2025-04-01:2025-05-08',
    'v1:2:18/54/04/0857:10025736:2025-04-01:2025-05-08',
    'v1:6:9/40/04/0470/S:10032629:2023-11-01:2024-10-31',
    'v1:6:9/40/04/0470/S:10032629:2022-11-01:2023-10-31',
    'v1:6:9/40/04/0470/S:10032629:2021-11-01:2022-10-31',
    'v1:6:9/40/04/0470/S:10032629:2020-11-01:2021-10-31',
    'v1:6:9/40/04/0470/S:10032629:2019-11-01:2020-10-31'
  );

-- This one we just need to correct the end date
-- Because the previous team added a foreign key constraint, and used a made up value for the ID, we're stuck in a
-- circular dependency between returns and versions trying to update it. The only way is to drop the dependency, apply
-- the fix, then add the constraint back in.
BEGIN;

ALTER TABLE "returns".versions DROP CONSTRAINT return_id;

UPDATE "returns"."returns"
SET
  end_date = '2024-02-04',
  return_id = 'v1:2:03/28/77/0028:10046670:2023-04-01:2024-02-04'
WHERE
  return_id = 'v1:2:03/28/77/0028:10046670:2023-04-01:2024-02-05';

UPDATE "returns".versions
SET
  return_id = 'v1:2:03/28/77/0028:10046670:2023-04-01:2024-02-04'
WHERE
  return_id = 'v1:2:03/28/77/0028:10046670:2023-04-01:2024-02-05';

ALTER TABLE "returns".versions ADD CONSTRAINT return_id FOREIGN KEY (return_id) REFERENCES "returns"."returns"(return_id);

COMMIT;
