/* Replace with your SQL commands */
ALTER TABLE "returns"."lines"
ALTER COLUMN start_date type timestamp without timezone;

ALTER TABLE "returns"."lines"
ALTER COLUMN end_date type timestamp without timezone;
