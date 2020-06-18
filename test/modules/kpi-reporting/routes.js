'use-strict';

const {
  experiment,
  test
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const server = require('../../../index');

const createRequest = (queryString) => {
  return {
    method: 'get',
    url: '/returns/1.0/kpi/licencesBySeason?' + queryString,
    headers: {
      Authorization: process.env.JWT_TOKEN
    }
  };
};

experiment('/modules/kpi-reporting/routes', () => {
  experiment('when the correct query string vlaues are received', () => {
    test('responds with a status code of 200', async () => {
      const request = createRequest('startDate=2019-01-01&endDate=2019-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('when the endDate is before the start date', () => {
    test('responds with a status code of 400', async () => {
      const request = createRequest('startDate=2019-01-01&endDate=2018-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('when the endDate or startDate is not a date', () => {
    test('responds with a status code of 400', async () => {
      const request = createRequest('startDate=2019-01-01&endDate=not-A-Date&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
    test('responds with a status code of 400', async () => {
      const request = createRequest('startDate=not-A-Date&endDate=2018-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('when the isSummer is not boolean', () => {
    test('responds with a status code of 400', async () => {
      const request = createRequest('startDate=2019-01-01&endDate=2019-12-31&isSummer=something');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
    test('responds with a status code of 400', async () => {
      const request = createRequest('startDate=not-A-Date&endDate=2018-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('when one of the query string properties are omitted', () => {
    test('responds with a status code 400 when startDate is missing', async () => {
      const request = createRequest('endDate=2018-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
    test('responds with a status code 400 when endDate is missing', async () => {
      const request = createRequest('startDate=2018-12-31&isSummer=true');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
    test('responds with a status code 400 when isSummer is missing', async () => {
      const request = createRequest('startDate=2018-12-31&endDate=2018-12-31');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });
});
