/**
 * Generates a mongo-sql query object to find completed returns and the
 * user who initially completed it
 * @param  {Object} filter - filter object
 * @return {Object}        - mongo-sql query
 */
const completedReturns = (filter = {}) => {
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
    }]
  };
};

module.exports = {
  completedReturns
};
