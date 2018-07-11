const server = require('../../../index');

module.exports = () => {
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
      returns_frequency: 'monthly',
      status: 'pending',
      metadata: JSON.stringify({points: ['SP 1234 5567']})
    }
  };
  return server.inject(request);
};
