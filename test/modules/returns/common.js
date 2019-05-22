const server = require('../../../index');
const uuid = require('uuid/v4');

const headers = { Authorization: process.env.JWT_TOKEN };

module.exports = {
  returns: {
    create: () => {
      const request = {
        method: 'POST',
        url: `/returns/1.0/returns`,
        headers,
        payload: {
          return_id: uuid(),
          regime: 'water-test',
          licence_type: 'abstraction-test',
          licence_ref: '012/45/5675/R01',
          start_date: '2018-01-01',
          end_date: '2018-12-31',
          due_date: '2019-01-31',
          returns_frequency: 'month',
          status: 'due',
          metadata: JSON.stringify({
            points: ['SP 1234 5567']
          }),
          return_requirement: 'test',
          under_query: true,
          under_query_comment: 'Return was water damaged'
        }
      };
      return server.inject(request);
    },

    delete: returnId => {
      const request = {
        method: 'DELETE',
        url: `/returns/1.0/returns/${returnId}`,
        headers
      };
      return server.inject(request);
    }
  },

  versions: {
    get: versionId => {
      const request = {
        method: 'GET',
        url: `/returns/1.0/versions/${versionId}`,
        headers
      };
      return server.inject(request);
    },
    delete: versionId => {
      const request = {
        method: 'DELETE',
        url: `/returns/1.0/versions/${versionId}`,
        headers
      };
      return server.inject(request);
    },
    create: (returnId, versionNumber = 1) => {
      const request = {
        method: 'POST',
        url: `/returns/1.0/versions`,
        headers,
        payload: {
          version_id: uuid(),
          return_id: returnId,
          user_id: 'mail@example.com',
          user_type: 'customer',
          version_number: versionNumber,
          metadata: '{}',
          nil_return: false,
          current: true
        }
      };
      return server.inject(request);
    }
  },

  lines: {
    create: (versionId) => {
      const metadata = {
        meterManufacturer: 'Super Accurate Meters',
        meterSerialNumber: '00010001'
      };

      const request = {
        method: 'POST',
        url: `/returns/1.0/lines`,
        headers,
        payload: {
          line_id: uuid(),
          version_id: versionId,
          substance: 'water',
          quantity: 255.056,
          unit: 'cm',
          start_date: '2018-08-01',
          end_date: '2018-08-01',
          time_period: 'day',
          metadata: JSON.stringify(metadata)
        }
      };

      return server.inject(request);
    },

    delete: lineId => {
      const request = {
        method: 'DELETE',
        url: `/returns/1.0/lines/${lineId}`,
        headers
      };

      return server.inject(request);
    }
  }
};
