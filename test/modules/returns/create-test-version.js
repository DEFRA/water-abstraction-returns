const server = require('../../../index');

module.exports = () => {
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
      nil_return: false
    }
  };
  return server.inject(request);
};
