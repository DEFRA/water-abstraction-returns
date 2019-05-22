'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('lab').script();

const { expect } = require('code');
const server = require('../../../index');

const { returns } = require('./common');

experiment('Check returns API', () => {
  let returnId;
  let createReturnResponse;
  let deleteReturnResponse;

  beforeEach(async () => {
    createReturnResponse = await returns.create();
    returnId = createReturnResponse.result.data.return_id;
  });

  afterEach(async () => {
    deleteReturnResponse = await returns.delete(returnId);
  });

  test('The returns API should accept a new return', async () => {
    expect(createReturnResponse.statusCode).to.equal(201);
  });

  test('The returns API should update a return', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/returns/${returnId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        metadata: JSON.stringify({points: ['SP 456 789']}),
        received_date: '2018-10-01'
      }
    };
    const res = await server.inject(request);
    expect(res.statusCode).to.equal(200);
  });

  test('The returns API should list returns for a particular regime/licence type', async () => {
    const filter = {
      regime: 'water-test',
      licence_type: 'abstraction-test'
    };

    const request = {
      method: 'GET',
      url: `/returns/1.0/returns?filter=${JSON.stringify(filter)}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };
    const res = await server.inject(request);
    expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.payload);

    expect(body.data).to.be.an.array();
    expect(body.error).to.equal(null);
  });

  test('The returns API should update a return to void status', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/returns/${returnId}`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        status: 'void'
      }
    };
    const res = await server.inject(request);
    expect(res.statusCode).to.equal(200);
    const body = JSON.parse(res.payload);
    expect(body.data.status).to.equal('void');
  });

  test('a return can be deleted', async () => {
    expect(deleteReturnResponse.statusCode).to.equal(200);
  });
});
