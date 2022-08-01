const controller = require('./controller')

const status = {
  method: 'GET',
  handler: controller.getStatus,
  options: {
    auth: false,
    description: 'Checks if the service is alive'
  },
  path: '/status'
}

module.exports = [status]
