const config = require('../../../config.js');
const { Pool } = require('pg');

const pool = new Pool(config.pg);

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
