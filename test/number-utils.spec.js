'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var NumberUtils = require('../src/number-utils');
var Parser = require('../src/parser');

describe('NumberUtils Specification', function() {

    var parser;

    beforeEach(function() {
        parser = new Parser({
            decimalSeparator: '.',
            thousandsSeparator: undefined,
            precision: 20,
            roundingMode: Constants.ROUNDING_MODE_HALF_UP
        });
    });

    it('when first number scale is greater than second then should return first number scale', function() {
        var first = parser.parse("-12.3456789");
        var second = parser.parse("1234567.89");
        var maxScale = NumberUtils.maxScale(first, second);
        expect(maxScale).to.equal(7);
    });

    it('when second number scale is greater than first then should return second number scale', function() {
        var first = parser.parse("123456789");
        var second = parser.parse("-0.123456789");
        var maxScale = NumberUtils.maxScale(first, second);
        expect(maxScale).to.equal(9);
    });

});
