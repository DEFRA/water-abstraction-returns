/*
  https://eaflood.atlassian.net/browse/WATER-5253

  We were asked to look into why BOXI (based on NALD data) was reporting one thing for a return, but WRLS was showing
  another. (See https://eaflood.atlassian.net/browse/WATER-5252 )

  **WRLS**

  |Month|Quantity |
  |-----|---------|
  |May  |42,872.08|
  |June |53,590.08|

  **BOXI**

  |Month|Quantity |
  |-----|---------|
  |May  |53,590.08|
  |June |42,872.08|

  The return in question was ‘weekly’. Initially, we thought that perhaps when importing the data, the import had
  incorrectly determined the weeks. In WRLS, a week in a return submission always runs from Sunday to Saturday.
  Therefore, all weekly end dates should align with a Saturday.

  In this particular case, the weeks were right. It was due to NALD allowing submissions on any day of the week before
  2013, and because of this, a return line in NALD fell into MAY (2013-05-31), whereas in WRLS it fell into JUNE
  (2013-06-01).

  But when we checked, we found 1,937 lines (41 return submissions) where the weekend date for the line _is_ wrong.

  These lines run from Monday to Sunday. For example, Monday 22 October 2018 to Sunday 28 October 2018. The correct
  dates should be Sunday 21 October to Saturday 27.

  The affected periods for the 31 licences are

  |Start Date |End Date  |
  |-----------|----------|
  |2017--11-01|2018-10-31|
  |2018--04-01|2018-10-31|
  |2017--05-01|2018-10-31|

  > It was just one licence for the last period.

  By deducting a day from the effected start and end dates, we are able to correct the lines. The only wrinkle was those
  in the period 2018--04-01 to 2018-10-31. There first lines were set as Monday 26 March 2018 to Sunday 1 April. By
  deducting a day from the start and end dates,we'd push the line back into the previous return.

  It looks like that is what the previous team did in the latest version (the issue is all in versions that were
  subsequently superseded), but it causes a line to appear for March in a return log listed as being April to October.

  We checked NALD and not only are the dates correct, these 'March' lines are not there. Plus all the lines in WRLS are
  null or 0. So, we delete those as part of this correction.
*/

-- 1.
-- Delete the 'March' lines that should not be in the return submission
DELETE FROM "returns".lines
WHERE
  time_period = 'week'
  AND end_date = '2018-04-01';

-- 2.
-- Then delete the 'March' lines the previous team added when attempting to 'correct' the later submissions
DELETE FROM "returns".lines l
USING "returns".versions v
WHERE v.version_id = l.version_id
  AND l.time_period = 'week'
  AND l.end_date = '2018-03-31'
  AND v.return_id IN (
    'v1:1:6/33/49/*G/0075/R02:10052764:2018-04-01:2018-10-31',
    'v1:1:6/33/49/*G/0075/R02:10052768:2018-04-01:2018-10-31',
    'v1:1:6/33/49/*G/0075/R02:10052770:2018-04-01:2018-10-31',
    'v1:1:6/33/37/*G/0427/R02:10053057:2018-04-01:2018-10-31',
    'v1:1:6/33/37/*G/0427/R02:10053058:2018-04-01:2018-10-31',
    'v1:1:6/33/49/*G/0075/R02:10053328:2018-04-01:2018-10-31'
  );

-- 3.
-- These are the lines where the end_date is a Sunday (and the start_date is a Monday), so we need to be pushed back by
-- 1 day. Again we've confirmed these dates against other returns and the calendar and this corrects the dates back into
-- alignment with all other weekly returns.
UPDATE "returns".lines
SET
  end_date = end_date - 1,
  start_date = start_date - 1
WHERE
  time_period = 'week'
  AND EXTRACT(DOW FROM end_date) = 0;
