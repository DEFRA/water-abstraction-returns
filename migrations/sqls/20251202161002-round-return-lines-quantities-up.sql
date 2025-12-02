/*
  Rounds existing return submission line quantities to 6 decimal places

  https://eaflood.atlassian.net/browse/WATER-5398
*/

UPDATE "returns".lines
SET quantity = ROUND(quantity, 6)
WHERE quantity IS NOT NULL
AND quantity != ROUND(quantity, 6);
