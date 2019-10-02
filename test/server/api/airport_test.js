/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - airport service module
 */
const airport = require('../../../server/api/airport.js');
const utils = require('../../../server/lib/utils');
const Airport = require('../../../server/models/Airport');

describe('api.airport', function () {
	it('airport', function () {
		expect(airport).to.be.an('object');
		expect(airport.getAllAirports).to.be.an('function');
		expect(airport.getAirportDetail).to.be.an('function');
		expect(airport.createAirport).to.be.an('function');
		expect(airport.updateAirport).to.be.an('function');
		expect(airport.deleteAirport).to.be.an('function');
	});

	let responseCode = 0, responseMessage = '', responseBody = {}, getHeaderTokenStub, airportFindStub,
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

	describe('getAllAirports scenarios', function () {
		before(function () {
      getHeaderTokenStub = sinon.stub(utils, 'getHeaderToken');
      airportFindStub = sinon.stub(Airport, "find");
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
		})

		after(function () {
			getHeaderTokenStub.restore();
			airportFindStub.restore();
		});

		it('should return invalid 401 response', async () => {
			const expectedResponse = { success: false, msg: 'Unable to find records!' };
			getHeaderTokenStub.returns(true);
			airportFindStub.yields({}, null);

			await airport.getAllAirports(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 1);
			assert.equal(logger.error.callCount, 1);
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.airport.getAllAirports');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.airport.getAllAirports - failed with error: {}');

			expect(responseCode).to.equal(401);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return invalid 402 response', async () => {
			const expectedResponse = { success: false, msg: 'no records found!' };
			getHeaderTokenStub.returns(true);
			airportFindStub.yields(null, false);

			await airport.getAllAirports(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 1);
			assert.equal(logger.error.callCount, 1);
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.airport.getAllAirports');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.airport.getAllAirports - no records found in db');

			expect(responseCode).to.equal(402);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return invalid 403 response', async () => {
			const expectedResponse = { success: false, msg: 'Unauthorized.' };
			getHeaderTokenStub.returns(false);

			await airport.getAllAirports(req, res);

			expect(res.send.calledOnce).to.be.true;
			expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			expect(logger.info.calledOnce).to.be.true;
			expect(logger.error.calledOnce).to.be.true;
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.airport.getAllAirports');
			expect(logger.error.firstCall.args[0]).to.deep.equal('ERROR IN METHOD - server.api.airport.getAllAirports - unauthorized to fetch records from db');

			expect(responseCode).to.equal(403);
			expect(responseMessage).to.deep.equal(expectedResponse);
		});

		it('should return valid 200 response', async () => {
			getHeaderTokenStub.returns(true);
			airportFindStub.yields(null, {});

			await airport.getAllAirports(req, res);

			expect(res.send.calledOnce).to.be.false;
			expect(res.json.calledOnce).to.be.true;
			expect(res.json.firstCall.args[0]).to.deep.equal({});
			expect(getHeaderTokenStub.calledOnce).to.be.true;

			assert.equal(logger.info.callCount, 2);
			expect(logger.error.calledOnce).to.be.false;
			expect(logger.info.firstCall.args[0]).to.deep.equal('METHOD ENTRY - server.api.airport.getAllAirports');
			expect(logger.info.secondCall.args[0]).to.deep.equal('METHOD EXIT - server.api.airport.getAllAirports - successfully fetched records from db');

			expect(responseCode).to.equal(200);
			expect(responseBody).to.deep.equal({});
		});
	});
});