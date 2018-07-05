const Lab = require('lab');
const lab = Lab.script();
const Code = require('code');

lab.experiment('Test NALD import', () => {
  lab.test('should fail', () => {
    Code.expect(false).to.equal(true);
  });
});

exports.lab = lab;
