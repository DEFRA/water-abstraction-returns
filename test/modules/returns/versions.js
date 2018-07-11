/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const server = require('../../../index');

const createTestReturn = require('./create-test-return');
const createTestVersion = require('./create-test-version');

lab.experiment('Check versions API', () => {
  lab.before(async () => {
    await createTestReturn();
  });

  lab.test('The versions API should accept a new return version', async () => {
    const res = await createTestVersion();
    Code.expect(res.statusCode).to.equal(201);
  });

  lab.test('The versions API should update a version', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/versions/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        user_type: 'external'
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.payload);
    Code.expect(body.data.user_type).to.equal('external');
  });

  lab.test('The versions API should list versions for a particular return', async () => {
    const filter = {
      return_id: 'test'
    };

    const request = {
      method: 'GET',
      url: `/returns/1.0/versions?filter=${JSON.stringify(filter)}`,
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

  lab.test('The versions API should delete a particular version', async () => {
    const request = {
      method: 'DELETE',
      url: `/returns/1.0/versions/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };
    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);
  });
});
