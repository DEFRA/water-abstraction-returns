/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();

const { expect } = require('@hapi/code');

const { parseRequest } = require('../../../../src/modules/reports/lib/request-parser');

const filter = {
  regime: 'regime',
  licence_type: 'licenceType'
};

lab.experiment('parseRequest', () => {
  lab.test('It should parse JSON encoded filter in request', async () => {
    const request = {
      query: {
        filter: JSON.stringify(filter)
      }
    };
    const result = parseRequest(request);
    expect(result.filter).to.equal(filter);
  });

  lab.test('Filter should default to empty object if not specified', async () => {
    const request = {
      query: {
      }
    };
    const result = parseRequest(request);
    expect(result.filter).to.equal({});
  });
});
