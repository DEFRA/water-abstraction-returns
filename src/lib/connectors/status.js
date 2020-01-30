require('dotenv').config();
const { pool } = require('./db');
const pkg = require('../../../package.json');

const getStatus = async () => {
  try {
    const { rows: data } = await pool.query('select hello from returns.status;');
    return {
      data,
      error: null,
      version: pkg.version
    };
  } catch (error) {
    return { error };
  }
};

exports.getStatus = getStatus;
