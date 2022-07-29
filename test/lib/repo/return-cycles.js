'use-strict'
const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()
const repo = require('../../../src/lib/repo/return-cycles')
const { pool } = require('../../../src/lib/connectors/db')
const queries = require('../../../src/lib/repo/queries/return-cycles')

const data = { foo: 'bar' }

experiment('./lib/repo/return-cycles', () => {
  let result

  beforeEach(async => {
    sandbox.stub(pool, 'query').resolves({ rows: [data], error: null })
  })

  afterEach(async => {
    sandbox.restore()
  })

  experiment('.getReturnCycleStatsReport', () => {
    const startDate = '2018-01-01'

    beforeEach(async () => {
      result = await repo.getReturnCycleStatsReport(startDate)
    })

    test('calls pool.query with correct query and params', async () => {
      expect(pool.query.calledWith(
        queries.returnCycleStatsReport, [startDate]
      )).to.be.true()
    })

    test('resolves with array', async () => {
      expect(result).to.be.an.array()
    })
  })

  experiment('.getOrCreateReturnCycle', () => {
    const cycle = {
      startDate: '2020-01-01',
      endDate: '2020-12-31',
      isSummer: true
    }

    beforeEach(async () => {
      result = await repo.getOrCreateReturnCycle(cycle)
    })

    test('calls pool.query with correct query and params', async () => {
      expect(pool.query.calledWith(
        queries.upsert, [cycle.startDate, cycle.endDate, cycle.isSummer]
      )).to.be.true()
    })

    test('resolves with a single row', async () => {
      expect(result).to.equal(data)
    })
  })

  experiment('.getReturnCycle', () => {
    const returnCycleId = 'test-id'

    beforeEach(async () => {
      result = await repo.getReturnCycle(returnCycleId)
    })

    test('calls pool.query with correct query and params', async () => {
      expect(pool.query.calledWith(
        queries.getReturnCycle, [returnCycleId]
      )).to.be.true()
    })

    test('resolves with a single row', async () => {
      expect(result).to.equal(data)
    })
  })

  experiment('.getReturnCycleReturns', () => {
    const returnCycleId = 'test-id'

    beforeEach(async () => {
      result = await repo.getReturnCycleReturns(returnCycleId)
    })

    test('calls pool.query with correct query and params', async () => {
      expect(pool.query.calledWith(
        queries.getReturnCycleReturns, [returnCycleId]
      )).to.be.true()
    })

    test('resolves with an array', async () => {
      expect(result).to.be.an.array()
    })
  })
})
