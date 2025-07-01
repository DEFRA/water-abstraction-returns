/*
We have a need for a unique id that is not based on the return.

This id will eventually be used in the public view as our unique reference in the database.

The public view currently sets the existing 'return_id' as the 'id'. This will change in another change.
 */

ALTER TABLE "returns"."returns" DROP COLUMN id;
