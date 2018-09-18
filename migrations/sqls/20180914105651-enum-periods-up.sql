/* Replace with your SQL commands */
/* Replace with your SQL commands */

CREATE TYPE returns_period AS ENUM ('year', 'quarter', 'month', 'week', 'day');

ALTER TABLE "returns"."returns"
ALTER COLUMN "returns_frequency" TYPE returns_period
USING "returns_frequency"::returns_period;
