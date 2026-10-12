/*
 * https://eaflood.atlassian.net/browse/WATER-5854
 *
 * The /search page in water-abstraction-system joins return_requirements to return logs to find returns matching a
 * search term. The join is on `return_requirement_id`, which has no index, so every search scans the whole table —
 * for both the results query and the count query that drives pagination.
 *
 * Since the returns table is one of the larger tables (1.1 GB currently), an index here should help to speed up the
 * search.
 */
CREATE INDEX idx_returns_return_requirement_id
ON "returns"."returns" (return_requirement_id);
