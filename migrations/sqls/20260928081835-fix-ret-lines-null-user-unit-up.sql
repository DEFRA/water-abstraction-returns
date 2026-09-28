/*
  https://eaflood.atlassian.net/browse/WATER-5843

  We've been working to ensure that WRLS aligns with NALD regarding historical returns.

  After checking the data again, we found some imported return submission lines where the `user_unit` is set to
  `'null'`.

  These should be set to `'m³'`.

  This adds a data fix migration script to correct the affected records.
 */

UPDATE "returns".lines l
SET
  user_unit = 'm³',
  updated_at = NOW()
WHERE
  l.user_unit = 'null';
