/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - aircraft service module
 */
let aircraft = require('../../../server/api/aircraft.js');

describe('api.aircraft', function () {

    it('aircraft', function () {
        expect(aircraft).to.be.an('object');
        expect(aircraft.getAllAircrafts).to.be.an('function');
        expect(aircraft.getAircraftDetail).to.be.an('function');
        expect(aircraft.createAircraft).to.be.an('function');
        expect(aircraft.updateAircraft).to.be.an('function');
        expect(aircraft.deleteAircraft).to.be.an('function');
    });
});