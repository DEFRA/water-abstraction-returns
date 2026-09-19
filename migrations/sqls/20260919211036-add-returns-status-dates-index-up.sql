/*
 * https://eaflood.atlassian.net/browse/WATER-5829
 *
 * We're switching what periods our returns invitation journey shows to display all return cycles with return logs
 * awaiting an invitation, instead of two fixed periods based on the current date.
 *
 * However, because the return logs table is so large, we can't get the query to return in a timely enough manor without
 * adding an index.
 *
 * Without the index, the DB engine has to scan every record in the table for those with the right status ('due'), a
 * null `due_date`, and an end date less than the current date. Locally, without an index, this was taking 6.5 seconds
 * of which most of that was just scanning the table.
 *
 * With the index in place, the query can quickly locate the relevant records without scanning the entire table,
 * significantly improving performance (from 6.5 seconds to almost instantaneous).
 */
CREATE INDEX idx_returns_status_dates
ON "returns"."returns" (status, due_date, end_date);
