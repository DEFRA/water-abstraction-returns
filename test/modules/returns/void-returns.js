const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('lab').script();
const { expect } = require('code');
const voidReturnsController = require('../../../src/modules/returns/void-returns');
const { repo } = require('../../../src/modules/returns/returns');

const createReturn = (licenceNumber, returnId) => {
  const ret = {
    return_id: returnId,
    regime: 'unit-test-regime',
    licence_type: 'unit-test',
    licence_ref: licenceNumber,
    start_date: (new Date()).toISOString(),
    end_date: (new Date()).toISOString(),
    returns_frequency: 'month',
    status: 'due',
    created_at: (new Date()).toISOString(),
    return_requirement: `requirement-${returnId}`,
    due_date: (new Date()).toISOString(),
    source: 'NALD'
  };

  return repo.create(ret);
};

const deleteAllTestReturns = () => {
  return repo.delete({
    regime: 'unit-test-regime'
  });
};

const getAllTestReturns = () => {
  return repo.find({
    regime: 'unit-test-regime'
  });
};

experiment('returns/voidReturnsController', () => {
  experiment('.patchVoidReturns', () => {
    let updatedReturns;
    let result;

    beforeEach(async () => {
      await createReturn('unit-test-licence-1', 'unit-test-licence-1-v-1');
      await createReturn('unit-test-licence-1', 'unit-test-licence-1-v-2');
      await createReturn('unit-test-licence-1', 'unit-test-licence-1-v-3');
      await createReturn('unit-test-licence-1', 'unit-test-licence-1-v-4');
      await createReturn('unit-test-licence-2', 'unit-test-licence-2-v-1');
      await createReturn('unit-test-licence-2', 'unit-test-licence-2-v-2');

      const request = {
        payload: {
          licenceNumber: 'unit-test-licence-1',
          licenceType: 'unit-test',
          regime: 'unit-test-regime',
          validReturnIds: [
            'unit-test-licence-1-v-1',
            'unit-test-licence-1-v-2'
          ]
        }
      };

      result = await voidReturnsController.patchVoidReturns(request);

      ({ rows: updatedReturns } = await getAllTestReturns());
    });

    afterEach(async () => {
      await deleteAllTestReturns();
    });

    test('only two rows are affected', async () => {
      expect(result.rowCount).to.equal(2);
    });

    test('the valid returns are left as due', async () => {
      const valid1 = updatedReturns.find(x => x.return_id === 'unit-test-licence-1-v-1');
      const valid2 = updatedReturns.find(x => x.return_id === 'unit-test-licence-1-v-2');

      expect(valid1.status).to.equal('due');
      expect(valid2.status).to.equal('due');
    });

    test('the invalid returns are made void', async () => {
      const valid1 = updatedReturns.find(x => x.return_id === 'unit-test-licence-1-v-3');
      const valid2 = updatedReturns.find(x => x.return_id === 'unit-test-licence-1-v-3');

      expect(valid1.status).to.equal('void');
      expect(valid2.status).to.equal('void');
    });

    test('the returns for the other licence are left as due', async () => {
      const valid1 = updatedReturns.find(x => x.return_id === 'unit-test-licence-2-v-1');
      const valid2 = updatedReturns.find(x => x.return_id === 'unit-test-licence-2-v-2');

      expect(valid1.status).to.equal('due');
      expect(valid2.status).to.equal('due');
    });
  });
});
