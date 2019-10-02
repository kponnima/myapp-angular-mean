/*
 *  Mocha Server Unit Tests.
 *  UNIT TEST - helper module
 */
let _sinon = require('sinon');
let _chai = require('chai');
let _expect = _chai.expect;
let _assert = _chai.assert;
let _should = _chai.should();
let _proxyquire = require('proxyquire');

global.sinon = _sinon;
global.chai = _chai;
global.expect = _expect;
global.assert = _assert;
global.should = _should;
global.proxyquire = _proxyquire;

let logger = {
    info: sinon.spy(),
    error: sinon.spy()
}

global.logger = logger;