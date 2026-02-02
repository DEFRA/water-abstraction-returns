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
    const quantity = line.quantity

    // NOTE: We can't do a standard `quantity ? true : false` because it is valid to submit a line quantity of 0 and we
    // want to persist that to the DB. 0 in Node.js is interpreted as being falsy, which is not what we want here.
    return {
      ...line,
      quantity: quantity !== undefined && quantity !== null ? Number(quantity.toFixed(6)) : null
    }
  })
}

exports.preInsert = preInsert
