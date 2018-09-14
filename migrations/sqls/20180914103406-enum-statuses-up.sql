/* Replace with your SQL commands */

UPDATE "returns"."returns" SET status='completed' WHERE status='complete';

CREATE TYPE returns_status AS ENUM ('completed', 'due', 'received');

ALTER TABLE "returns"."returns"
ALTER COLUMN "status" TYPE returns_status
USING "status"::returns_status;
