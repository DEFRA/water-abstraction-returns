/*
  Adds and populates a new return_requirement_id UUID field to the table returns.returns

  https://eaflood.atlassian.net/browse/WATER-5254

  This migration will add a new return_requirement_id UUID field to the table returns.returns. It will then attempt to
  populate the return_requirement_id for existing records using the table water.return_requirements. It may not be
  possible to populate them all, which is why the return_requirement_id field will be left as nullable.
*/

ALTER TABLE "returns"."returns" DROP COLUMN return_requirement_id;
