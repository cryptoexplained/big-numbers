'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');

describe('Parser Specification', function() {

    var parser;

    beforeEach(function() {
        parser = new Parser({
            decimalSeparator: '.',
            thousandsSeparator: undefined,
            precision: 20,
            roundingMode: Constants.ROUNDING_MODE_HALF_UP
        });
    });

    it('should parse one', function() {
        var result = parser.parse(1);
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1]);
        expect(result.getScale()).to.equal(0);
    });

    it('should parse string', function() {
        var result = parser.parse("1.23456789");
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 8, 7, 6, 5, 4, 3, 2, 1]);
        expect(result.getScale()).to.equal(8);
    });

    it('should parse string with positive sign', function() {
        var result = parser.parse("+0.000456");
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([6, 5, 4]);
        expect(result.getScale()).to.equal(6);
    });

    it('should parse string with negative sign', function() {
        var result = parser.parse("-123000");
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([0, 0, 0, 3, 2, 1]);
        expect(result.getScale()).to.equal(0);
    });

    it('should parse number', function() {
        var result = parser.parse(1.23456789);
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 8, 7, 6, 5, 4, 3, 2, 1]);
        expect(result.getScale()).to.equal(8);
    });

    it('should parse number with positive sign', function() {
        var result = parser.parse(+0.000456);
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([6, 5, 4]);
        expect(result.getScale()).to.equal(6);
    });

    it('should parse number with negative sign', function() {
        var result = parser.parse(-123000);
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([0, 0, 0, 3, 2, 1]);
        expect(result.getScale()).to.equal(0);
    });

    it('should parse string with exponent', function() {
        var result = parser.parse("1.23456789e7");
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 8, 7, 6, 5, 4, 3, 2, 1]);
        expect(result.getScale()).to.equal(1);
    });

    it('should parse string with positive exponent', function() {
        var result = parser.parse("-5.55e+3");
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([0, 5, 5, 5]);
        expect(result.getScale()).to.equal(0);
    });

    it('should parse string with negative exponent', function() {
        var result = parser.parse("-555e-3");
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([5, 5, 5]);
        expect(result.getScale()).to.equal(3);
    });

    it('should parse string with exponent', function() {
        var result = parser.parse(1.23456789e7);
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 8, 7, 6, 5, 4, 3, 2, 1]);
        expect(result.getScale()).to.equal(1);
    });

    it('should parse string using custom configuration', function() {
        var result = parser.parse("1.234.567,89", {
            decimalSeparator: ',',
            thousandsSeparator: '.'
        });
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 8, 7, 6, 5, 4, 3, 2, 1]);
        expect(result.getScale()).to.equal(2);
    });

});
