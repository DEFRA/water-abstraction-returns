'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const { expect } = require('@hapi/code');

const statusConnector = require('../../../src/lib/connectors/status');
const { pool } = require('../../../src/lib/connectors/db');

experiment('lib/connectors/status', () => {
  experiment('.getStatus', () => {
    let response;

    beforeEach(async () => {
      sandbox.stub(pool, 'query').resolves({
        rows: [{
          hello: 'world'
        }]
      });
      response = await statusConnector.getStatus();
    });

    afterEach(async () => {
      sandbox.restore();
    });

    test('includes the response from the database', async () => {
      expect(response.data).to.equal([{ hello: 'world' }]);
    });

    test('includes the version from the package.json', async () => {
      expect(response.version).to.match(/\d*\.\d*\.\d*/);
    });
  });
});
