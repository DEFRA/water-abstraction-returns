const controller = require('./controller');

module.exports = [
  {
    method: 'GET',
    handler: controller.createRouteHandler('returnUserDetails'),
    path: '/returns/1.0/reports/user-details'
  },
  {
    method: 'GET',
    handler: controller.createRouteHandler('returnStatuses'),
    path: '/returns/1.0/reports/return-statuses'
  },
  {
    method: 'GET',
    handler: controller.createRouteHandler('returnLicenceCount'),
    path: '/returns/1.0/reports/licence-count'
  },
  {
    method: 'GET',
    handler: controller.createRouteHandler('returnFrequencies'),
    path: '/returns/1.0/reports/returns-frequencies'
  }

];
