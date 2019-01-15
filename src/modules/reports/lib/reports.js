/**
 * Generates a mongo-sql query object to find the user details of who
 * initially submitted returns which match the specified filter object
 * @param  {Object} filter - filter object
 * @return {Object}        - mongo-sql query
 */
const returnUserDetails = (filter = {}) => {
  return {
    type: 'select',
    table: 'returns.returns',
    where: filter,
    columns: ['returns.return_id', 'returns.licence_ref', 'returns.return_requirement', 'versions.created_at', 'versions.user_id', 'versions.user_type', 'versions.current'],
    joins: [{
      schema: 'returns',
      type: 'right',
      target: 'versions',
      on: {
        return_id: '$returns.return_id$',
        version_number: 1
      }
    }],
    sort: {
      'created_at': +1
    }
  };
};

/**
 * Gets a breakdown of statuses for the returns which match the specified
 * filter object
 * @param  {Object} [filter={}] - mongo-sql filter object for filtering returns table
 * @return {Object}             - mongo-sql query
 */
const returnStatuses = (filter = {}) => {
  return {
    type: 'select',
    table: 'returns.returns',
    where: filter,
    columns: ['status', 'COUNT(*)'],
    groupBy: 'status'
  };
};

/**
 * Get the number of unique licence numbers included in the returns which
 * match the specified filter object
 * @param  {Object} [filter={}] - mongo-sql filter object for filtering returns table
 * @return {Object}             - mongo-sql query
 */
const returnLicenceCount = (filter = {}) => {
  return {
    type: 'select',
    table: 'returns.returns',
    where: filter,
    columns: ['COUNT(DISTINCT(licence_ref))']
  };
};

/**
 * Get a breakdown of the count of returns frequencies for returns which match the
 * specified filter object
 * @param  {Object} [filter={}] - mongo-sql filter object for filtering returns table
 * @return {Object}             - mongo-sql query
 */
const returnFrequencies = (filter = {}) => {
  return {
    type: 'select',
    table: 'returns.returns',
    where: filter,
    columns: ['returns_frequency', 'COUNT(*)'],
    groupBy: 'returns_frequency'
  };
};

module.exports = {
  returnUserDetails,
  returnStatuses,
  returnLicenceCount,
  returnFrequencies
};
