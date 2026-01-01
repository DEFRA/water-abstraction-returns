/*
  https://eaflood.atlassian.net/browse/WATER-5435

  The B&D team marked a licence as expired on 1 July 2025 in NALD. The licence submits quarterly returns, so this expiry
  date lines up with the start date of the second quarterly period.

  When the overnight import job processed this, they expected

  - existing return logs for quarters 2, 3 and 4 to be voided
  - a new return log for 2025-07-01 to 2025-07-01 (one day) to be created

  The voiding happened, but no new return log was created. Their expectation is correct, and after investigation, we
  found the issue was an inconsistent check in
  [`CreateReturnLogsService`](https://github.com/DEFRA/water-abstraction-system).

  ```javascript
    // Good - equal to or greater than
    const startDateInPeriod = returnRequirement.returnVersion.startDate <= period.endDate

    // Good - equal to or greater than
    const endDateInPeriod = returnRequirement.returnVersion.endDate >= period.startDate

    // Bad - only greater than
    const licenceEndDateInPeriod = licenceEndDate > period.startDate
  ```

  As the start date for the second quarter is 2025-07-01 and the licence 'end date' is '2025-07-01',
  `CreateReturnLogsService` determines the second quarter does not need processing. We fixed it in [Fix missed returns
  when licence ends on start date](https://github.com/DEFRA/water-abstraction-system/pull/2815).

  This migration adds the missing return log, but only in production as production ID's are used.
*/

INSERT INTO "returns"."returns" (
  return_id,
  regime,
  licence_type,
  licence_ref,
  start_date,
  end_date,
  returns_frequency,
  status,
  "source",
  metadata,
  created_at,
  updated_at,
  received_date,
  return_requirement,
  due_date,
  under_query,
  under_query_comment,
  is_test,
  return_cycle_id,
  sent_date,
  id,
  return_requirement_id,
  quarterly
)
SELECT
  'v1:7:TH/039/0041/015:10078845:2025-07-01:2025-07-01',
  'water',
  'abstraction',
  'TH/039/0041/015',
  '2025-07-01',
  '2025-07-01',
  'day'::"returns".returns_period,
  'due'::"returns".returns_status,
  'WRLS',
  '{"nald": {"areaCode": "AGY4S", "formatId": 10078845, "regionCode": 7, "periodEndDay": "31", "periodEndMonth": "3", "periodStartDay": "1", "periodStartMonth": "4"}, "points": [{"name": "BOREHOLE AT STREATHAM PUMPING STATION", "ngr1": "TQ 29546 71028", "ngr2": null, "ngr3": null, "ngr4": null}], "isFinal": true, "version": 1, "isSummer": false, "isUpload": true, "purposes": [{"primary": {"code": "W", "description": "Water Supply"}, "tertiary": {"code": "330", "description": "Potable Water Supply - Direct"}, "secondary": {"code": "PWS", "description": "Public Water Supply"}}], "isCurrent": true, "description": "BOREHOLE AT STREATHAM PUMPING STATION", "isTwoPartTariff": false}'::jsonb,
  '2025-11-04 04:32:51.365',
  '2025-11-04 04:32:51.365',
  NULL,
  '10078845',
  NULL,
  false,
  NULL,
  false,
  '98d6b388-20b7-4514-b011-3a265bed91bd'::uuid,
  NULL,
  'd47df9a8-b923-4e9e-b543-8dfe480bdd38'::uuid,
  'f945f55e-972f-4709-84d2-6fbaa580f7a7'::uuid,
  true
WHERE
  NOT EXISTS (
    SELECT 1 FROM "returns"."returns" r WHERE r.return_id = 'v1:7:TH/039/0041/015:10078845:2025-07-01:2025-07-01'
  )
  AND EXISTS (
    SELECT 1
    FROM "returns"."return_cycles" rc
    WHERE rc.return_cycle_id = '98d6b388-20b7-4514-b011-3a265bed91bd'
  );
