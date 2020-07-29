
'use-strict';
const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const controller = require('../../../src/modules/kpi-reporting/controller');
const repo = require('../../../src/lib/repo/kpi-reporting');

experiment('/modules/kpi-reporting/controller', () => {
  const repoData = {
    data: [
      {
        total: 1,
        user_type: 'internal',
        status: 'completed',
        onTime: true
      },
      {
        total: 1,
        user_type: 'external',
        status: 'completed',
        onTime: true
      }
    ]
  };

  beforeEach(async => {
    sandbox.stub(repo, 'findReturnsKpiDataBySeason').resolves(repoData);
  });

  afterEach(async => {
    sandbox.restore();
  });

  const request = {
    query: {
      startDate: '2020-01-01',
      endDate: '2020-12-31',
      isSummer: true
    }
  };

  experiment('If data is returned from the repo', () => {
    let response;
    beforeEach(async () => {
      response = await controller.getReturnsKpiDataBySeason(request);
    });

    test('an array is returned with the data key', async () => {
      expect(response.data.length).to.equal(2);
      expect(response.data).to.be.array();
    });
    test('the repo is called with the correct query params', async () => {
      const args = repo.findReturnsKpiDataBySeason.lastCall.args;
      expect(args[0]).to.equal('2020-01-01');
      expect(args[1]).to.equal('2020-12-31');
      expect(args[2]).to.be.true();
    });
  });

  experiment('If NO data is returned from the repo', () => {
    test('Boom error with 404 status code is returned', async () => {
      repo.findReturnsKpiDataBySeason.resolves({ data: [] });
      const response = await controller.getReturnsKpiDataBySeason(request);
      expect(response.isBoom).to.be.true();
      expect(response.output.statusCode).to.equal(404);
      expect(response.output.payload.error).to.equal('Not Found');
      expect(response.output.payload.message).to.equal('Returns KPI data by season not found for start date 2020-01-01, end date 2020-12-31 and is summer flag true');
    });
  });
});
