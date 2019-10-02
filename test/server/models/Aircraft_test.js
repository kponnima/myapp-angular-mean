/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - Aircraft model module
 */
const Aircraft = require('../../../server/models/Aircraft');
const aircraft = new Aircraft();

describe('models.Aircraft', function () {

    it('Aircraft', function () {
        expect(Aircraft).to.be.an('model');
    });

    it('should be invalid if aircraft_no is empty', function (done) {
        aircraft.validate(function (err) {
            expect(err.errors.aircraft_no).to.exist;
            done();
        });
    });

    it('should be invalid if aircraft_id is empty', function (done) {
        aircraft.validate(function (err) {
            expect(err.errors.aircraft_id).to.exist;
            done();
        });
    });
});