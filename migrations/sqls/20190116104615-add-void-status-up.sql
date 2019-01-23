/* Replace with your SQL commands */
ALTER TYPE returns_status RENAME TO returns_status_old;

CREATE TYPE returns_status AS ENUM('completed', 'due', 'received', 'void');

ALTER TABLE returns.returns ALTER COLUMN status TYPE returns_status USING status::text::returns_status;

DROP TYPE returns_status_old;
