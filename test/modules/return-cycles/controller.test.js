'use-strict'
const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()
const controller = require('../../../src/modules/return-cycles/controller')
const repo = require('../../../src/lib/repo/return-cycles')

experiment('/modules/return-cycles/controller', () => {
  let result

  const data = {
    cycles: [{
      return_cycle_id: 'test-id'
    }]
  }

  const returnCycleId = 'test-id'
  const startDate = '2017-01-01'
  const request = {
    params: {
      returnCycleId
    },
    query: {
      startDate
    }
  }

  beforeEach(async => {
    sandbox.stub(repo, 'getReturnCycleStatsReport')
    sandbox.stub(repo, 'getReturnCycle')
    sandbox.stub(repo, 'getReturnCycleReturns')
  })

  afterEach(async => {
    sandbox.restore()
  })

  experiment('getReturnCyclesReport', () => {
    beforeEach(async () => {
      repo.getReturnCycleStatsReport.resolves(data.cycles)
      result = await controller.getReturnCyclesReport(request)
    })

    test('calls the expected repo method', async () => {
      expect(repo.getReturnCycleStatsReport.calledWith(
        startDate
      )).to.be.true()
    })

    test('resolves with the data camel-cased in a { data } envelope', async () => {
      expect(result).to.equal({
        data: [{
          returnCycleId
        }]
      })
    })
  })

  experiment('getReturnCycle', () => {
    experiment('when the cycle is found', () => {
      beforeEach(async () => {
        repo.getReturnCycle.resolves(data.cycles[0])
        result = await controller.getReturnCycle(request)
      })

      test('calls the expected repo method', async () => {
        expect(repo.getReturnCycle.calledWith(
          returnCycleId
        )).to.be.true()
      })

      test('resolves with the data camel-cased', async () => {
        expect(result).to.equal({
          returnCycleId
        })
      })
    })

    experiment('when the cycle is not found', () => {
      beforeEach(async () => {
        repo.getReturnCycle.resolves(undefined)
        result = await controller.getReturnCycle(request)
      })

      test('returns a Boom 404', async () => {
        expect(result.isBoom).to.be.true()
        expect(result.output.statusCode).to.equal(404)
      })
    })
  })

  experiment('getReturnCyclesReturns', () => {
    beforeEach(async () => {
      repo.getReturnCycleReturns.resolves(data.cycles)
      result = await controller.getReturnCycleReturns(request)
    })

    test('calls the expected repo method', async () => {
      expect(repo.getReturnCycleReturns.calledWith(
        returnCycleId
      )).to.be.true()
    })

    test('resolves with the data camel-cased in a { data } envelope', async () => {
      expect(result).to.equal({
        data: [{
          returnCycleId
        }]
      })
    })
  })
})
