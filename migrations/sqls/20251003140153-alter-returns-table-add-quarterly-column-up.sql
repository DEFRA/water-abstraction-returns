/*
  Adds and populates a new quaterly boolean field to the table returns.returns

  https://eaflood.atlassian.net/browse/WATER-5255

  This migration will add a new quarterly boolean field to the table returns.returns. It will then set the value
  to true for all return logs that match a quarertly return version.

  Note - We have to wrap the query in an anonymous code block because we depend on a table in another schema but when
  this is run in CI that schema does not exist.
*/

ALTER TABLE "returns"."returns" ADD COLUMN quarterly boolean default false not null;

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
    WITH quarterly_return_requirements AS (
      SELECT rr.return_requirement_id
      FROM water.return_requirements rr
      INNER JOIN water.return_versions rv
        ON rr.return_version_id = rv.return_version_id
      WHERE rv.quarterly_returns = true
    )

    UPDATE "returns"."returns" r
    SET quarterly = true
    FROM quarterly_return_requirements qrr
    WHERE r.return_requirement_id = qrr.return_requirement_id;
  END IF;
END
$$;
