'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');

describe('BigNumber Specification', function() {

    var parser;

    beforeEach(function() {
        parser = new Parser({
            decimalSeparator: '.',
            thousandsSeparator: undefined,
            precision: 20,
            roundingMode: Constants.ROUNDING_MODE_HALF_UP
        });
    });

    it('when negative abs then should return positive value', function() {
        var number = parser.parse("-543.21");
        var result = number.abs();
        console.log("Result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1, 2, 3, 4, 5]);
        expect(result.getScale()).to.equal(2);
    });



});
