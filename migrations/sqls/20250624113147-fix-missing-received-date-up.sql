/*
  Fix missing received date in return log

  https://eaflood.atlassian.net/browse/WATER-5075

  Whilst working on creating a new 'clean' empty VOID return logs job we found an edge case in the data.

  One of the return logs has submitted returns data but its `received_date` is missing.

  We believe this is a residual record that was effected by the issue in WATER-5057. There was a point that the timings
  of the FME WRLS to NALD and the FME/WRLS NALD to WRLS imports were out of sync which led to return logs getting their
  `received_date` blanked.

  To fix it, the dates needed to be manually re-entered into NALD and this one just appears to have been missed
*/
UPDATE "returns"."returns" SET received_date = '2025-05-09' WHERE "returns".return_id = 'v1:7:TH/039/0039/030/R02:10064887:2024-10-30:2025-03-31';
