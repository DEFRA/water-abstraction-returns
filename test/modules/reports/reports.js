/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const { expect } = require('code');

const { completedReturns } = require('../../../src/modules/reports/reports');

const filter = {
  regime: 'regime',
  licence_type: 'licenceType'
};

lab.experiment('completedReturns mongo-sql query generator', () => {
  let query;

  lab.beforeEach(async () => {
    query = completedReturns(filter);
  });

  lab.test('It should allow the filtering of returns', async () => {
    expect(query.where).to.equal(filter);
  });

  lab.test('It should contain the correct columns', async () => {
    expect(query.columns).to.equal([ 'returns.return_id',
      'returns.licence_ref',
      'returns.return_requirement',
      'versions.created_at',
      'versions.user_id',
      'versions.user_type',
      'versions.current' ]);
  });
});
