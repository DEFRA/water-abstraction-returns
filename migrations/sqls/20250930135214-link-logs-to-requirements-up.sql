/*
  Adds and populates a new return_requirement_id UUID field to the table returns.returns

  https://eaflood.atlassian.net/browse/WATER-5254

  This migration will add a new return_requirement_id UUID field to the table returns.returns. It will then attempt to
  populate the return_requirement_id for existing records using the table water.return_requirements. It may not be
  possible to populate them all, which is why the return_requirement_id field will be left as nullable.

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
        AND table_name = 'return_requirements'
    )
  THEN
    ALTER TABLE "returns"."returns" ADD COLUMN return_requirement_id UUID;

    UPDATE "returns"."returns" r
    SET return_requirement_id = rrv.return_requirement_id
    FROM water.licences l
    INNER JOIN (
      SELECT rr.return_requirement_id, rr.legacy_id, rv.licence_id
      FROM water.return_requirements rr
      INNER JOIN water.return_versions rv
        ON rr.return_version_id = rv.return_version_id
    ) rrv
      ON l.licence_id = rrv.licence_id
    WHERE r.licence_ref = l.licence_ref
      AND r.return_requirement::integer = rrv.legacy_id;
  END IF;
END
$$;
