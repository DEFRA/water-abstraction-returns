'use-strict';

const { pool } = require('../connectors/db');

const findReturnsKpiDataBySeason = async (startDate, endDate, isSummer) => {
  const sql = `
  SELECT
    SUM(CASE WHEN user_type IS NULL AND status = 'due' THEN 1 ELSE 0 END)::integer AS due,
    SUM(CASE WHEN user_type = 'internal' AND status = 'completed' AND received_date <= due_date THEN 1 ELSE 0 END)::integer AS internal_on_time,
    SUM(CASE WHEN user_type = 'internal' AND status = 'completed' AND received_date > due_date THEN 1 ELSE 0 END)::integer AS internal_late,
    SUM(CASE WHEN user_type = 'external' AND status = 'completed' AND received_date <= due_date THEN 1 ELSE 0 END)::integer AS external_on_time,
    SUM(CASE WHEN user_type = 'external' AND status = 'completed' AND received_date > due_date THEN 1 ELSE 0 END)::integer AS external_late
  FROM returns.returns as r
  LEFT JOIN
  (SELECT user_type, return_id FROM returns.versions 
  WHERE current = true
  ) AS v ON
  v.return_id = r.return_id
  WHERE r.status <> 'void'
  AND r.start_date >= $1 AND r.end_date <= $2
  AND (r.metadata->'isSummer') = $3;`;

  const params = [startDate, endDate, isSummer];
  const data = await pool.query(sql, params);
  return { data: data.rows };
};

exports.findReturnsKpiDataBySeason = findReturnsKpiDataBySeason;
