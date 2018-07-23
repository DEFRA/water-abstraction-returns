const config = require('../../../config.js');
const { Pool } = require('pg');

const pool = new Pool(config.pg);

pool.on('acquire', () => {
  const { totalCount, idleCount, waitingCount } = pool;
  if (totalCount === config.pg.max && idleCount === 0 && waitingCount > 0) {
    console.log(`Pool low on connections::Total:${totalCount},Idle:${idleCount},Waiting:${waitingCount}`);
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
