/**
 * Test creating/fetching a return
 */
'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const server = require('../../../index');

const { returns, versions, lines } = require('./common');

experiment('Check versions API', () => {
  let versionId;
  let returnId;
  let lineId;
  let versionResponse;
  let returnResponse;
  let createLineResponse;
  let deleteLineResponse;

  beforeEach(async () => {
    returnResponse = await returns.create();
    returnId = returnResponse.result.data.return_id;

    versionResponse = await versions.create(returnId);
    versionId = versionResponse.result.data.version_id;

    createLineResponse = await lines.create(versionId);
    lineId = createLineResponse.result.data.line_id;
  });

  afterEach(async () => {
    deleteLineResponse = await lines.delete(lineId);
    await versions.delete(versionId);
    await returns.delete(returnId);
  });

  test('The lines API should accept a new line', async () => {
    expect(createLineResponse.statusCode).to.equal(201);
  });

  test('The lines API should edit a returns line', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/lines/${lineId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        substance: 'H2O',
        time_period: 'week'
      }
    };

    const res = await server.inject(request);
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.payload);

    expect(body.data.substance).to.equal('H2O');
    expect(body.data.time_period).to.equal('week');
  });

  test('The lines API should delete a returns line', async () => {
    expect(deleteLineResponse.statusCode).to.equal(200);
  });
});
