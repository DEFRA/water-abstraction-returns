/* Replace with your SQL commands */

/* Remove not null condition */
ALTER TABLE "returns"."lines"
ALTER COLUMN user_unit DROP NOT NULL;
