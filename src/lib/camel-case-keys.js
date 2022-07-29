'use strict'

const { camelCase } = require('lodash')
const deepMapKeys = require('map-keys-deep-lodash')

/**
 * Camel cases the keys of an object, or an array of objects.
 * @param {Array|Object} data The array of objects, or object that is to
 * have it's keys camel cased
 */
const camelCaseKeys = data =>
  deepMapKeys(data, (value, key) => camelCase(key))

module.exports = camelCaseKeys
