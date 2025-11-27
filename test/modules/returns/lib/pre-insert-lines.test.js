'use strict'

const {
  experiment,
  test,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { preInsert } = require('../../../../src/modules/returns/lib/pre-insert-lines')
const { expect } = require('@hapi/code')

const sandbox = require('sinon').createSandbox()

experiment('modules/returns/lib/pre-insert-lines', () => {
  let result
  const line = {
    startDate: '2019-01-01',
    endDate: '2019-01-31'
  }

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('when the data object contains a quantity', () => {
    test('that is a whole number it returns that number', async () => {
      result = await preInsert([{
        ...line,
        quantity: 1
      }])

      expect(result).to.equal([{
        ...line,
        quantity: 1
      }])
    })

    test('that is a number with less than 6 decimal places it returns that number', async () => {
      result = await preInsert([{
        ...line,
        quantity: 1.123
      }])

      expect(result).to.equal([{
        ...line,
        quantity: 1.123
      }])
    })

    test('that is a number with more than 6 decimal places it returns that number rounded to 6 decimal places', async () => {
      result = await preInsert([{
        ...line,
        quantity: 1.12345678
      }])

      expect(result).to.equal([{
        ...line,
        quantity: 1.123457
      }])
    })
  })

  experiment('when the data object does not contain a quantity', () => {
    test('because it is undefined it returns null', async () => {
      result = await preInsert([line])

      expect(result).to.equal([{
        ...line,
        quantity: null
      }])
    })

    test('because it is null it returns null', async () => {
      result = await preInsert([{
        ...line,
        quantity: null
      }])

      expect(result).to.equal([{
        ...line,
        quantity: null
      }])
    })
  })
})
