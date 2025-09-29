/*
  Set returns with blank lines to nil returns

  https://eaflood.atlassian.net/browse/WATER-5192

  There was an issue with the return submission process that meant that some returns were being submitted with blank
  return lines when they weren't supposed to be. This migration will set those returns to be nil returns and remove the
  blank return submission lines.
*/

BEGIN;

-- Step 1: Find all return versions that are not currently marked as nil returns but have no lines with a quantity
WITH not_nil_with_blank_lines AS (
	SELECT v.version_id
  FROM "returns".versions v
  LEFT JOIN "returns".lines l
    ON v.version_id = l.version_id AND l.quantity IS NOT NULL
  WHERE l.version_id IS null
  AND v.nil_return = false
)
-- Step 2: Update those return versions to be nil returns
UPDATE "returns".versions v
SET nil_return = true
FROM not_nil_with_blank_lines nn
WHERE v.version_id = nn.version_id;

-- Step 3: Remove any lines associated with those now nil returns
DELETE FROM "returns".lines l
USING "returns".versions v
WHERE v.version_id = l.version_id
AND v.nil_return = true;

COMMIT;
