const { pool } = require('../../lib/connectors/db')
const config = require('../../../config')

const deleteLines = () => {
  return pool.query(`
    delete
    from returns.lines l
    using returns.versions v, returns.returns r
    where
      l.version_id = v.version_id
      and
      v.return_id = r.return_id
      and
      r.is_test = true;
  `)
}

const deleteVersions = () => {
  return pool.query(`
    delete
    from returns.versions v
    using returns.returns r
    where
      v.return_id = r.return_id
      and
       r.is_test = true;
  `)
}

const deleteReturns = () => {
  return pool.query(`
    delete
    from returns.returns
    where is_test = true;
  `)
}

const deleteTestData = async (request, h) => {
  if (!config.isProduction) {
    await deleteLines()
    await deleteVersions()
    await deleteReturns()
  }
  return h.response().code(204)
}

exports.deleteTestData = deleteTestData
