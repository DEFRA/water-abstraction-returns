'use-strict';

const { pool } = require('../connectors/db');

const findReturnsKpiDataBySeason = async (startDate, endDate, isSummer) => {
  const sql = `
  SELECT count(r.return_id)::integer as total,
  user_type, 
  status,
  CASE WHEN received_date <= due_date THEN true ELSE false END AS on_time
  FROM returns.returns as r
  LEFT JOIN (SELECT user_type, return_id FROM returns.versions 
  WHERE current = true
  ) AS v ON
  v.return_id = r.return_id
  WHERE r.status <> 'void'
  AND r.start_date >= '${startDate}' AND r.end_date <= '${endDate}'
  AND (r.metadata->'isSummer') = '${isSummer}'
  GROUP BY user_type, status, on_time;`;

  const data = await pool.query(sql);
  return { data: data.rows };
};

exports.findReturnsKpiDataBySeason = findReturnsKpiDataBySeason;
