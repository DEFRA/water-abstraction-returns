const server = require('../../../index');

module.exports = {
  createTestReturn: () => {
    const request = {
      method: 'POST',
      url: `/returns/1.0/returns`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        return_id: 'test',
        regime: 'water-test',
        licence_type: 'abstraction-test',
        licence_ref: '012/45/5675/R01',
        start_date: '2018-01-01',
        end_date: '2018-12-31',
        returns_frequency: 'month',
        status: 'due',
        metadata: JSON.stringify({points: ['SP 1234 5567']}),
        return_requirement: 'test'
      }
    };
    return server.inject(request);
  },

  deleteTestReturn: () => {
    const request = {
      method: 'DELETE',
      url: `/returns/1.0/returns/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };
    return server.inject(request);
  },

  createTestVersion: () => {
    const request = {
      method: 'POST',
      url: `/returns/1.0/versions`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      },
      payload: {
        version_id: 'test',
        return_id: 'test',
        user_id: 'mail@example.com',
        user_type: 'customer',
        version_number: 1,
        metadata: '{}',
        nil_return: false,
        current: true
      }
    };
    return server.inject(request);
  },

  deleteTestVersion: () => {
    const request = {
      method: 'DELETE',
      url: `/returns/1.0/versions/test`,
      headers: {
        Authorization: process.env.JWT_TOKEN
      }
    };
    return server.inject(request);
  }
};
