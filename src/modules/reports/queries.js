const { pool } = require('../../lib/connectors/db');

/**
 * Gets a list of completed returns, together with the user ID (email address)
 * and user type of the user who submitted the first version of that return
 * Note: this may not be the same as the current return version
 * @param  {String} regime      - the licence regime, e,g, `water`
 * @param  {String} licenceType - the licence type, e.g. `abstraction`
 * @return {Promise}              resolves with DB report data
 */
const getCompletedReturns = (regime, licenceType) => {
  const params = [regime, licenceType];
  const query = `
  SELECT r.return_id, r.licence_ref, v.created_at, v.user_id, v.user_type, v.current, r.return_requirement
  FROM "returns".returns r
  JOIN "returns".versions v ON r.return_id=v.return_id AND v.version_number=1
  WHERE r.regime=$1 and r.licence_type=$2
  AND r.status='completed'`;
  return pool.query(query, params);
};

module.exports = {
  getCompletedReturns
};
