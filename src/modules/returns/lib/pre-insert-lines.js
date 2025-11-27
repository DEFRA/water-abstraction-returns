'use strict'

/**
 * The preInsert hook allows the data to be modified prior to insert.
 *
 * @param {Object} data
 * @returns {Promise<Object>} data with quantity rounded to 6 decimal points
 */
const preInsert = async data => {
  const lines = Array.isArray(data) ? data : [data]
  return lines.map(line => {
    return {
      ...line,
      quantity: line.quantity ? Number(line.quantity.toFixed(6)) : null
    }
  })
}

exports.preInsert = preInsert
