require('dotenv').config();
const { query } = require('./db');

async function getAll () {
  try {
    const { data, error } = await query('select hello from returns.status;');
    return { data, error };
  } catch (error) {
    return { error };
  }
}

module.exports = {
  getAll
};
