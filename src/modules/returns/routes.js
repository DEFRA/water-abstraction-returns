const returnsApi = require('./returns');
const versionsApi = require('./versions');
const linesApi = require('./lines');

module.exports = [
  ...returnsApi.getRoutes(),
  ...versionsApi.getRoutes(),
  ...linesApi.getRoutes()
];
