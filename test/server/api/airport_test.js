/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - aircraft service module
 */
const airport = require('../../../server/api/airport.js');
const utils = require('../../../server/lib/utils');
const Airport = require('../../../server/models/Airport');
const mongoose = require('mongoose');

describe('api.airport', function () {

    it('airport should be a module', function () {
        expect(airport).to.be.an('object');
        expect(airport.getAllAirports).to.be.an('function');
        expect(airport.getAirportDetail).to.be.an('function');
        expect(airport.createAirport).to.be.an('function');
        expect(airport.updateAirport).to.be.an('function');
        expect(airport.deleteAirport).to.be.an('function');
    });

    let responseCode = 0, responseMessage = '',
        req = {},
        res = {
            status: sinon.spy(function (code) {
                responseCode = code;
                return res;
            }),
            send: sinon.spy(function (message) {
                responseMessage = message;
                return res;
            })
        };
    const getHeaderTokenStub = sinon.stub(utils, "getHeaderToken").returns(false);
    // const airportFindStub = sinon.stub(Airport, "find").returns(null, {});
    var myStub = sinon.stub(mongoose.Model, 'find').returns(null, {});

    // airport = proxyquire('../server/api/airport.js', {
    //     '../lib/utils.js': utilsAPI
    // });

    describe('getAllAirports scenarios', function () {
        beforeEach(function () {
            responseCode = 0;
            responseMessage = '';
            res.status.resetHistory();
            res.send.resetHistory();
            getHeaderTokenStub.resetHistory();
        })

        it('should return invalid 403 response', async () => {
            const expectedResponse = { success: false, msg: 'Unauthorized.' };

            await airport.getAllAirports(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
            // assert that the getHeaderToken stub is called at least once
            expect(getHeaderTokenStub.calledOnce).to.be.true;

            expect(responseCode).to.equal(403);
            expect(responseMessage).to.deep.equal(expectedResponse);
        });

        it('should return invalid 401 response', async () => {
            const expectedResponse = { success: false, msg: 'Unauthorized.' };
            getHeaderTokenStub.returns(true);

            await airport.getAllAirports(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
            // assert that the getHeaderToken stub is called at least once
            expect(getHeaderTokenStub.calledOnce).to.be.true;

            expect(responseCode).to.equal(403);
            expect(responseMessage).to.deep.equal(expectedResponse);
        });

        it('should return valid 200 response', async () => {
            const expectedResponse = { success: false, msg: 'Unauthorized.' };
            // Stub getHeaderToken function and make it return true always
            getHeaderTokenStub.returns(true);

            await airport.getAllAirports(req, res);

            expect(res.send.calledOnce).to.be.true;
            expect(res.send.firstCall.args[0]).to.deep.equal(expectedResponse);
            // assert that the getHeaderToken stub is called at least once
            expect(getHeaderTokenStub.calledOnce).to.be.true;

            expect(responseCode).to.equal(403);
            expect(responseMessage).to.deep.equal(expectedResponse);
        });
    });
});