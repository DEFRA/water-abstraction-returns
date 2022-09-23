const { experiment, test, afterEach, beforeEach } = exports.lab = require('@hapi/lab').script()
const { expect } = require('@hapi/code')

const sinon = require('sinon')
const sandbox = sinon.createSandbox()

const statusConnector = require('../../../src/lib/connectors/status')
const controller = require('../../../src/modules/core/controller')

experiment('modules/core/controller', () => {
  experiment('.getStatus', () => {
    beforeEach(async () => {
      sandbox.stub(statusConnector, 'getStatus').resolves({ test: true })
    })

    afterEach(async () => {
      sandbox.restore()
    })

    test('returns the status', async () => {
      const response = await controller.getStatus()
      expect(response.test).to.be.true()
    })

    test('throw if the status connector errors', async () => {
      statusConnector.getStatus.rejects()
      await expect(controller.getStatus()).to.reject()
    })
  })
})
