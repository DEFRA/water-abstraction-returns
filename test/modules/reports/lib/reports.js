/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const { expect } = require('code');

const reports = require('../../../../src/modules/reports/lib/reports');

const filter = {
  regime: 'regime',
  licence_type: 'licenceType'
};

lab.experiment('returnUserDetails report', () => {
  lab.test('It should generate a mongo-sql query with the correct filter', async () => {
    const query = reports.returnUserDetails(filter);
    expect(query.where).to.equal(filter);
  });

  lab.test('Filter should default to empty object', async () => {
    const query = reports.returnUserDetails();
    expect(query.where).to.equal({});
  });

  lab.test('It should contain the correct columns', async () => {
    const query = reports.returnUserDetails(filter);
    expect(query.columns).to.equal([ 'returns.return_id',
      'returns.licence_ref',
      'returns.return_requirement',
      'versions.created_at',
      'versions.user_id',
      'versions.user_type',
      'versions.current' ]);
  });
});

lab.experiment('returnStatuses report', () => {
  lab.test('It should generate a mongo-sql query with the correct filter', async () => {
    const query = reports.returnStatuses(filter);
    expect(query.where).to.equal(filter);
  });

  lab.test('Filter should default to empty object', async () => {
    const query = reports.returnStatuses();
    expect(query.where).to.equal({});
  });

  lab.test('It should contain the correct columns', async () => {
    const query = reports.returnStatuses(filter);
    expect(query.columns).to.equal(['status', 'COUNT(*)']);
  });

  lab.test('It should group by returns status', async () => {
    const query = reports.returnStatuses(filter);
    expect(query.groupBy).to.equal('status');
  });
});

lab.experiment('returnLicenceCount report', () => {
  lab.test('It should generate a mongo-sql query with the correct filter', async () => {
    const query = reports.returnLicenceCount(filter);
    expect(query.where).to.equal(filter);
  });

  lab.test('Filter should default to empty object', async () => {
    const query = reports.returnLicenceCount();
    expect(query.where).to.equal({});
  });

  lab.test('It should contain the correct columns', async () => {
    const query = reports.returnLicenceCount(filter);
    expect(query.columns).to.equal(['COUNT(DISTINCT(licence_ref))']);
  });
});

lab.experiment('returnFrequencies report', () => {
  lab.test('It should generate a mongo-sql query with the correct filter', async () => {
    const query = reports.returnFrequencies(filter);
    expect(query.where).to.equal(filter);
  });

  lab.test('Filter should default to empty object', async () => {
    const query = reports.returnFrequencies();
    expect(query.where).to.equal({});
  });

  lab.test('It should contain the correct columns', async () => {
    const query = reports.returnFrequencies(filter);
    expect(query.columns).to.equal(['returns_frequency', 'COUNT(*)']);
  });

  lab.test('It should group by returns frequency', async () => {
    const query = reports.returnFrequencies(filter);
    expect(query.groupBy).to.equal('returns_frequency');
  });
});
