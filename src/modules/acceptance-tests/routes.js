const controller = require('./controller')
const config = require('../../../config')

const deleteTestData = {
  method: 'DELETE',
  handler: controller.deleteTestData,
  path: '/returns/1.0/acceptance-tests',
  config: {
    description: 'Deletes any data created by the acceptance tests setup'
  }
}

const routes = []

if (config.isAcceptanceTestTarget) {
  routes.push(deleteTestData)
}

module.exports = routes
