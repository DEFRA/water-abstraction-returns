/* Replace with your SQL commands */
ALTER TABLE "returns"."returns" DROP CONSTRAINT unique_return;

ALTER TABLE "returns"."returns" DROP COLUMN return_requirement;

ALTER TABLE "returns"."versions" DROP CONSTRAINT unique_version;

ALTER TABLE "returns"."lines" DROP CONSTRAINT unique_line;
