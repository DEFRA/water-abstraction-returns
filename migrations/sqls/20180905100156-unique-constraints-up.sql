/* Replace with your SQL commands */
ALTER TABLE "returns"."returns"
ADD COLUMN return_requirement character varying COLLATE pg_catalog."default";

/* add return format */
UPDATE "returns"."returns"
SET return_requirement=split_part(return_id, ':', 4);

/* Add not null condition */
ALTER TABLE "returns"."returns"
ALTER COLUMN return_requirement SET NOT NULL;

/* Add unique constraint */
ALTER TABLE "returns"."returns"
ADD CONSTRAINT unique_return UNIQUE (regime, licence_type, licence_ref, start_date, end_date, return_requirement);

ALTER TABLE "returns"."versions"
ADD CONSTRAINT unique_version UNIQUE (return_id, version_number);

ALTER TABLE "returns"."lines"
ADD CONSTRAINT unique_line UNIQUE (version_id, substance, start_date, end_date);
