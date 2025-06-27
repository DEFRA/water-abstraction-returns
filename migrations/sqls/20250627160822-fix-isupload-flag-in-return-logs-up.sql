/*
  Fix migration for returns with wrong isUpload flag

  https://eaflood.atlassian.net/browse/WATER-5117

  Billing & Data, ahead of generating return invitations for the quarterly return logs for the very first time, wanted
  to confirm what external users would see.

  In pre-production they have an external user login linked to multiple Anglian Water company licences. They could see
  the return logs they expected, but not the 'Bulk upload' link.

  The link only appears if the user has licences with 'due' return logs, and at least one of them has both

  - The `isCurrent` flag in metadata set to true
  - The `isUpload` flag in metadata set to true

  When we examined the licences they were viewing, we found that the `isUpload` flag was false, even though the return
  versions used to generate the return logs had 'Multiple uploads' set to true.

  This was due to an error in the logic of the engine that generates return logs when a return version is added.

  It was using the old `is_upload` column against the return requirement instead of the new `multiple_upload` column
  against the return version.

  We no longer populate that column, which is why it was always being set to false.

  We've fixed the engine issue in [Set isUpload from return version
  multiple_upload](https://github.com/DEFRA/water-abstraction-system/pull/2145). This fix migration corrects the 750 (at
  time of writing) return logs that have been generated with `isUpload` set incorrectly.
*/
UPDATE "returns"."returns" SET metadata = metadata || '{"isUpload": true}' WHERE return_id IN (
  SELECT
    r.return_id
  FROM "returns"."returns" r
  INNER JOIN water.return_requirements rr
    ON rr.legacy_id::text = r.return_requirement
  INNER JOIN water.return_versions rv
    ON rv.return_version_id = rr.return_version_id
  WHERE
    r."source" = 'WRLS'
    AND r.metadata->>'isUpload' = 'false'
    AND rv.multiple_upload = TRUE
);
