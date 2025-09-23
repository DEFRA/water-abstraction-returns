/*
  Remove lines for nil returns

  https://eaflood.atlassian.net/browse/WATER-5278

  A bug has been reported by the business that when a return is submitted as a nil return, return lines are incorrectly
  being created. This bug has now been fixed, but we are left with some return lines that should not be there.

  This migration will remove any return lines that may exist for nil returns.
*/

DELETE FROM "returns".lines l
USING "returns".versions v
WHERE v.version_id = l.version_id
  AND v.nil_return = true;
