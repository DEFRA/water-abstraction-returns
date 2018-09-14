/* Replace with your SQL commands */

ALTER TABLE "returns"."returns"
ALTER COLUMN "returns_frequency" TYPE character varying COLLATE pg_catalog."default";


DROP TYPE IF EXISTS returns_period;
