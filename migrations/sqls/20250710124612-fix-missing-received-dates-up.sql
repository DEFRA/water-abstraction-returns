/*
  Data fix submitted rtn logs missing received date

  https://eaflood.atlassian.net/browse/WATER-5145

  We received a report of a 'live' issue with a licence's return logs appearing to be messed up ( WATER-5137 ).

  Upon investigation, we found that the return logs in NALD were corrupted. However, this raised the question of how
  many other return logs have return submissions with a null `received_date`.

  The answer is 233! (in `production`)

  We've identified which ones are affected and determined what their `received_date` should be.

  If we can link the return log to the NALD return form log and it has a received date, we pull that through. We then
  apply either that date or the date the return was submitted, whichever is the earliest.

  If the NALD return form log does not have a received date, we use the date the submission was created instead.

  This migration will correct the return logs.
*/

DO $$
BEGIN
  IF EXISTS
    (
      SELECT
        1
      FROM
        information_schema.tables
      WHERE
        table_schema = 'import'
        AND table_name = 'NALD_RET_FORM_LOGS'
    )
  THEN
    WITH fix_details AS (
      SELECT
        results.return_id,
        (least(results.ret_submission_created_date, results.nald_received_date)) AS missing_received_date
      FROM (
        SELECT
          r.return_id,
          (to_date((CASE WHEN nrfl."RECD_DATE" = 'null' THEN NULL ELSE nrfl."RECD_DATE" END), 'DD/MM/YYYY')) AS nald_received_date,
          (SELECT MIN(av.created_at)::date FROM "returns".versions av WHERE av.return_id = r.return_id ) AS ret_submission_created_date
        FROM
          "returns"."returns" r
        INNER JOIN "returns".versions v
          ON v.return_id = r.return_id
        LEFT JOIN "import"."NALD_RET_FORM_LOGS" nrfl
          ON nrfl."FGAC_REGION_CODE" = substring(r.return_id, 4, 1) AND nrfl."ARTY_ID" = r.return_requirement AND to_date(nrfl."DATE_FROM", 'DD/MM/YYYY') = r.start_date
        WHERE
          r.received_date IS NULL
          AND v."current" = TRUE
      ) results
    )
    UPDATE
      "returns"."returns" r
    SET
      received_date = missing_received_date,
      status = 'completed'
    FROM
      fix_details f
    WHERE
      r.return_id = f.return_id;
  END IF;
END
$$;
