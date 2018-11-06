/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const server = require('../../../index');

const { createTestReturn, deleteTestReturn } = require('./common');

lab.experiment('Check returns API', () => {
  lab.test('The returns API should accept a new return', async () => {
    const res = await createTestReturn();
    Code.expect(res.statusCode).to.equal(201);

    const payload = JSON.parse(res.payload);

    const { created_at: createdAt, ...rest} = payload.data;

    Code.expect(rest).to.equal({
      'return_id': 'test',
      'regime': 'water-test',
      'licence_type': 'abstraction-test',
      'licence_ref': '012/45/5675/R01',
      'start_date': '2018-01-01',
      'end_date': '2018-12-31',
      'returns_frequency': 'month',
      'status': 'due',
      'source': null,
      'metadata': {
        'points': [
          'SP 1234 5567'
        ]
      },
      'updated_at': null,
      'received_date': null,
      'return_requirement': 'test',
      'due_date': '2019-01-31',
      'under_query': true,
      'under_query_comment': 'Return was water damaged'
    });
  });

  lab.test('The returns API should update a return', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/returns/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        metadata: JSON.stringify({points: ['SP 456 789']}),
        received_date: '2018-10-01'
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);
  });

  lab.test('The returns API should list returns for a particular regime/licence type', async () => {
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
    Code.expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.payload);

    Code.expect(body.data).to.be.an.array();
    Code.expect(body.error).to.equal(null);
  });

  lab.test('The returns API should delete a particular return', async () => {
    const res = await deleteTestReturn();
    Code.expect(res.statusCode).to.equal(200);
  });
});
