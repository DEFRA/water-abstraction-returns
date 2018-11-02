const moment = require('moment');
const pg = require('pg');
const config = require('../../../config.js');

const { Pool } = pg;
const logger = require('../logger');

// Set dates to format YYYY-MM-DD rather than full date/time string with timezone
pg.types.setTypeParser(1082, 'text', function (val) {
  return moment(val).format('YYYY-MM-DD');
});

const pool = new Pool(config.pg);

pool.on('acquire', () => {
  const { totalCount, idleCount, waitingCount } = pool;
  if (totalCount === config.pg.max && idleCount === 0 && waitingCount > 0) {
    logger.info(`Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`);
  }
});

function query (queryString, params) {
  return new Promise((resolve, reject) => {
    pool.query(queryString, params)
      .then(res => {
        resolve({
          data: res.rows,
          error: null
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = { query, pool };
