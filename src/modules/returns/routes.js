const returnsApi = require('./returns');
const versionsApi = require('./versions');

module.exports = [
  ...returnsApi.getRoutes(),
  ...versionsApi.getRoutes()
];
