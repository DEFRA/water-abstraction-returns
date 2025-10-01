/*
  Adds and populates a new return_requirement_id UUID field to the table returns.returns

  https://eaflood.atlassian.net/browse/WATER-5254

  This migration will add a new return_requirement_id UUID field to the table returns.returns. It will then attempt to
  populate the return_requirement_id for existing records using the table water.return_requirements. It may not be
  possible to populate them all, which is why the return_requirement_id field will be left as nullable.
*/

BEGIN;

ALTER TABLE "returns"."returns" ADD COLUMN return_requirement_id UUID;

WITH return_requirement_ids AS (
  SELECT r.id, rrv.return_requirement_id
  FROM "returns"."returns" r
  INNER JOIN water.licences l
    ON r.licence_ref = l.licence_ref
  INNER JOIN (
    SELECT rr.return_requirement_id, rr.return_version_id, rr.legacy_id, rv.licence_id
    FROM water.return_requirements rr
    INNER JOIN water.return_versions rv
      ON rr.return_version_id = rv.return_version_id
    ) rrv
    ON l.licence_id = rrv.licence_id AND r.return_requirement::integer = rrv.legacy_id
)
UPDATE "returns"."returns" r
SET return_requirement_id = rri.return_requirement_id
FROM return_requirement_ids rri
WHERE r.id = rri.id;

COMMIT;
