'use-strict';

const { pool } = require('../connectors/db');

const findReturnsKpiDataBySeason = async (startDate, endDate, isSummer) => {
  const sql = `
  SELECT
    SUM(CASE WHEN user_type IS NULL AND status = 'due' THEN 1 ELSE 0 END) AS due,
    SUM(CASE WHEN user_type = 'internal' AND status = 'completed' AND received_date <= due_date THEN 1 ELSE 0 END) AS internal_on_time,
    SUM(CASE WHEN user_type = 'internal' AND status = 'completed' AND received_date > due_date THEN 1 ELSE 0 END) AS internal_late,
    SUM(CASE WHEN user_type = 'external' AND status = 'completed' AND received_date <= due_date THEN 1 ELSE 0 END) AS external_on_time,
    SUM(CASE WHEN user_type = 'external' AND status = 'completed' AND received_date > due_date THEN 1 ELSE 0 END) AS external_late
  FROM returns.returns as r
  LEFT JOIN
  (SELECT user_type, return_id FROM returns.versions 
  WHERE current = true
  ) AS v ON
  v.return_id = r.return_id
  WHERE r.status <> 'void'
  AND r.start_date >= '${startDate}' AND r.end_date <= '${endDate}'
  AND (r.metadata->'isSummer') = '${isSummer}';`;

  const data = await pool.query(sql);
  return { data: data.rows };
};

exports.findReturnsKpiDataBySeason = findReturnsKpiDataBySeason;
