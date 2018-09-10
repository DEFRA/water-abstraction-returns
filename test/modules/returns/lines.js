/**
 * Test creating/fetching a return
 */
'use strict';
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Code = require('code');
const server = require('../../../index');

const { createTestReturn, deleteTestReturn, createTestVersion, deleteTestVersion } = require('./common');

lab.experiment('Check versions API', () => {
  lab.before(async () => {
    await createTestReturn();
    await createTestVersion();
  });

  lab.after(async () => {
    await deleteTestVersion();
    await deleteTestReturn();
  });

  lab.test('The lines API should accept a new line', async () => {
    const metadata = {
      meterManufacturer: 'Super Accurate Meters',
      meterSerialNumber: '00010001'
    };

    const request = {
      method: 'POST',
      url: `/returns/1.0/lines`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        line_id: 'test',
        version_id: 'test',
        substance: 'water',
        quantity: 255.056,
        unit: 'cm',
        start_date: '2018-08-01',
        end_date: '2018-08-01',
        time_period: 'day',
        metadata: JSON.stringify(metadata)
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(201);

    const body = JSON.parse(res.payload);

    Code.expect(parseFloat(body.data.quantity)).to.equal(255.056);
    Code.expect(body.data.unit).to.equal('cm');
  });

  lab.test('The lines API should edit a returns line', async () => {
    const request = {
      method: 'PATCH',
      url: `/returns/1.0/lines/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        substance: 'H2O',
        time_period: 'week'
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);

    const body = JSON.parse(res.payload);

    Code.expect(body.data.substance).to.equal('H2O');
    Code.expect(body.data.time_period).to.equal('week');
  });

  lab.test('The lines API should delete a returns line', async () => {
    const request = {
      method: 'DELETE',
      url: `/returns/1.0/lines/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };

    const res = await server.inject(request);
    Code.expect(res.statusCode).to.equal(200);
  });
});
