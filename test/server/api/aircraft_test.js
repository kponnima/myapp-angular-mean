/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - aircraft service module
 */
const aircraft = require('../../../server/api/aircraft.js');
const utils = require('../../../server/lib/utils');
const Aircraft = require('../../../server/models/Aircraft');

describe('api.aircraft', function () {

	it('aircraft', function () {
		expect(aircraft).to.be.an('object');
		expect(aircraft.getAllAircrafts).to.be.an('function');
		expect(aircraft.getAircraftDetail).to.be.an('function');
		expect(aircraft.createAircraft).to.be.an('function');
		expect(aircraft.updateAircraft).to.be.an('function');
		expect(aircraft.deleteAircraft).to.be.an('function');
	});

	let responseCode = 0, responseMessage = '', responseBody = {}, getHeaderTokenStub, aircraftFindStub,
		req = {},
		res = {
			status: sinon.spy(function (code) {
				responseCode = code;
				return res;
			}),
			send: sinon.spy(function (message) {
				responseMessage = message;
				return res;
			}),
			json: sinon.spy(function (body) {
				responseBody = body;
				return res;
			})
		};
  let logger = global.logger;
  
	describe('getAllAircrafts scenarios', function () {
		before(function () {
      getHeaderTokenStub = sinon.stub(utils, 'getHeaderToken');
      aircraftFindStub = sinon.stub(Aircraft, "find");
		});

		beforeEach(function () {
			responseCode = 0;
			responseMessage = '';
			responseBody = {};
			res.status.resetHistory();
			res.send.resetHistory();
			logger.info.resetHistory();
      logger.error.resetHistory();
      getHeaderTokenStub.resetHistory();
		});

		after(function () {
			getHeaderTokenStub.restore();
			aircraftFindStub.restore();
		});

		it('should return invalid 401 response', async () => {
			const expectedResponse = { success: false, msg: 'Unable to find records!' };
      getHeaderTokenStub.returns(true);
      aircraftFindStub.yields({}, null);

			await aircraft.getAllAircrafts(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 1);
			assert.equal(logger.error.callCount, 1);
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.aircraft.getAllAircrafts');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - failed with error: {}');

			expect(responseCode).to.equal(401);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return invalid 402 response', async () => {
			const expectedResponse = { success: false, msg: 'no records found!' };
			getHeaderTokenStub.returns(true);
			aircraftFindStub.yields(null, false);

			await aircraft.getAllAircrafts(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 1);
			assert.equal(logger.error.callCount, 1);
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.aircraft.getAllAircrafts');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - no records found in db');

			expect(responseCode).to.equal(402);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return invalid 403 response', async () => {
			const expectedResponse = { success: false, msg: 'Unauthorized.' };
			getHeaderTokenStub.returns(false);

			await aircraft.getAllAircrafts(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			expect(logger.info.calledOnce).to.be.true;
			expect(logger.error.calledOnce).to.be.true;
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.aircraft.getAllAircrafts');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - unauthorized to fetch records from db');

			expect(responseCode).to.equal(403);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return valid 200 response', async () => {
			getHeaderTokenStub.returns(true);
			aircraftFindStub.yields(null, {});

			await aircraft.getAllAircrafts(req, res);

			expect(res.send.calledOnce).to.be.false;
			expect(res.json.calledOnce).to.be.true;
			expect(res.json.firstCall.args[0]).to.deep.equal({});
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 2);
			expect(logger.error.calledOnce).to.be.false;
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.aircraft.getAllAircrafts');
			expect(logger.info.secondCall.args[0]).to.deep.equal('METHOD EXIT - server.api.aircraft.getAllAircrafts - successfully fetched records from db');

			expect(responseCode).to.equal(200);
			expect(responseBody).to.deep.equal({});
		});
	});
});