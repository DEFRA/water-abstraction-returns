'use-strict';
const { experiment, test, beforeEach, afterEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const repos = require('../../../src/lib/repo/kpi-reporting');
const { pool } = require('../../../src/lib/connectors/db');

experiment('./lib/repo/kpi-reporting', () => {
  beforeEach(async => {
    sandbox.stub(pool, 'query').resolves({ rows: [], error: null });
  });

  afterEach(async => {
    sandbox.restore();
  });

  const query = `
  SELECT count(r.return_id) as total,
  user_type, 
  status,
  CASE WHEN received_date <= due_date THEN true ELSE false END AS on_time
  FROM returns.returns as r
  LEFT JOIN (SELECT user_type, return_id FROM returns.versions 
  WHERE current = true
  ) AS v ON
  v.return_id = r.return_id
  WHERE r.status <> 'void'
  AND r.start_date >= 'undefined' AND r.end_date <= 'undefined'
  AND (r.metadata->'isSummer') = 'undefined'
  GROUP BY user_type, status, on_time;`;

  test('the correct params are used to call db pool query', async () => {
    await repos.findReturnsKpiDataBySeason();
    expect(pool.query.lastCall.args[0]).to.be.equal(query);
    expect(pool.query.lastCall.args.length).to.be.equal(1);
  });

  test('the correct data shape is returned', async () => {
    const response = await repos.findReturnsKpiDataBySeason();
    expect(response).to.equal({ data: [] });
  });
});