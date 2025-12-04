/*
  Rounds existing return submission line quantities to 6 decimal places

  https://eaflood.atlassian.net/browse/WATER-5398

  The WHERE clause speeds up the update from around +10 minutes to around 25 seconds when tested on dev by only
  targeting rows where the quantity is not NULL or already rounded to 6 decimal places.
*/

UPDATE "returns".lines
SET quantity = ROUND(quantity, 6)
WHERE quantity IS NOT NULL
AND quantity != ROUND(quantity, 6);
