'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { preInsert } = require('../../../../src/modules/returns/lib/pre-insert');
const returnCycleRepo = require('../../../../src/lib/repo/return-cycles');
const { expect } = require('@hapi/code');

const sandbox = require('sinon').createSandbox();

const createReturn = (startDate, endDate, isSummer) => ({
  start_date: startDate,
  end_date: endDate,
  metadata: JSON.stringify({ isSummer })
});

experiment('modules/returns/lib/pre-insert', () => {
  let result;

  beforeEach(async () => {
    sandbox.stub(returnCycleRepo, 'getOrCreateReturnCycle');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('when a return cycle is found or created', () => {
    const returnCycleId = 'test-id';

    beforeEach(async () => {
      returnCycleRepo.getOrCreateReturnCycle.resolves({
        return_cycle_id: returnCycleId
      });
    });

    experiment('for a full winter/all year return', async () => {
      beforeEach(async () => {
        const ret = createReturn('2018-04-01', '2019-03-31', false);
        result = await preInsert(ret);
      });

      test('uses correct cycle dates for a full winter/all year return', async () => {
        console.log(returnCycleRepo.getOrCreateReturnCycle.lastCall.args);
        expect(returnCycleRepo.getOrCreateReturnCycle.calledWith({
          startDate: '2018-04-01',
          endDate: '2019-03-31',
          isSummer: false
        })).to.be.true();
      });

      test('resolves with the cycle ID', async () => {
        expect(result.return_cycle_id).to.equal(returnCycleId);
      });
    });

    experiment('for a partial winter/all year return', async () => {
      beforeEach(async () => {
        const ret = createReturn('2019-02-01', '2019-03-28', false);
        result = await preInsert(ret);
      });

      test('uses correct cycle dates for a full winter/all year return', async () => {
        expect(returnCycleRepo.getOrCreateReturnCycle.calledWith({
          startDate: '2018-04-01',
          endDate: '2019-03-31',
          isSummer: false
        })).to.be.true();
      });

      test('resolves with the cycle ID', async () => {
        expect(result.return_cycle_id).to.equal(returnCycleId);
      });
    });

    experiment('for a full year summer return', async () => {
      beforeEach(async () => {
        const ret = createReturn('2017-11-01', '2018-10-31', true);
        result = await preInsert(ret);
      });

      test('uses correct cycle dates for a full winter/all year return', async () => {
        expect(returnCycleRepo.getOrCreateReturnCycle.calledWith({
          startDate: '2017-11-01',
          endDate: '2018-10-31',
          isSummer: true
        })).to.be.true();
      });

      test('resolves with the cycle ID', async () => {
        expect(result.return_cycle_id).to.equal(returnCycleId);
      });
    });

    experiment('for a partial year summer return', async () => {
      beforeEach(async () => {
        const ret = createReturn('2017-12-12', '2018-09-31', true);
        result = await preInsert(ret);
      });

      test('uses correct cycle dates for a full winter/all year return', async () => {
        expect(returnCycleRepo.getOrCreateReturnCycle.calledWith({
          startDate: '2017-11-01',
          endDate: '2018-10-31',
          isSummer: true
        })).to.be.true();
      });

      test('resolves with the cycle ID', async () => {
        expect(result.return_cycle_id).to.equal(returnCycleId);
      });
    });
  });

  experiment('when a return cycle is not found or created', () => {
    beforeEach(async () => {
      returnCycleRepo.getOrCreateReturnCycle.resolves(undefined);
      const ret = createReturn('2019-02-01', '2019-03-28', false);
      result = await preInsert(ret);
    });

    test('return cycle ID is null', async () => {
      expect(result.return_cycle_id).to.be.null();
    });
  });
});
