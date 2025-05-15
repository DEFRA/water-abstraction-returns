/*
  Change user id for imported return submissions

  https://eaflood.atlassian.net/browse/WATER-5053

  Unfortunately, the email assigned to the historic NALD return submissions we import from NALD is causing problems for
  the legacy code that generates the return cycles report.

  It believes that `imported@from.nald` is an invalid email address, so it is throwing an error when reading the
  submission records.

  We've found that it is happy if we change the email to `imported.from@nald.gov.uk`, so this data fix does that.
*/

UPDATE "returns".versions SET user_id = 'imported.from@nald.gov.uk' WHERE user_id = 'imported@from.nald';
