const returnsApi = require('./returns');

module.exports = [
  ...returnsApi.getRoutes()
];
