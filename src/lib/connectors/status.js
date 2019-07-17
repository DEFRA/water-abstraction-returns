require('dotenv').config();
const { query } = require('./db');
const pkg = require('../../../package.json');

const getStatus = async () => {
  try {
    const { data, error } = await query('select hello from returns.status;');
    return {
      data,
      error,
      version: pkg.version
    };
  } catch (error) {
    return { error };
  }
};

exports.getStatus = getStatus;
