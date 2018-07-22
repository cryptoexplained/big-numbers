'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');
var Formatter = require('../src/formatter');
var Functions = require('../src/functions');

describe('Exponent Specification', function() {

    var parser;
    var formatter;
    var defaultConfig = {
        decimalSeparator: '.',
        thousandsSeparator: undefined,
        precision: 20,
        roundingMode: Constants.ROUNDING_MODE_HALF_UP
    };

    beforeEach(function() {
        parser = new Parser(defaultConfig);
        formatter = new Formatter(defaultConfig);
    });

    it('should calculate exponent 1', function() {
        var number = parser.parse("10");
        var result = Functions.exp(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Exp result: " + formatter.format(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9,7,5,9,6,1,5,6,1,7,6,0,8,4,9,7,5,6,4,6,2,0,2,2]);
        expect(result.getScale()).to.equal(19);
    });

    it('should calculate exponent 2', function() {
        var number = parser.parse("25");
        var result = Functions.exp(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Exp result: " + formatter.format(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1,7,4,9,5,6,4,3,1,6,1,4,2,5,2,7,8,5,8,3,7,3,3,9,9,8,4,0,0,2,7]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate exponent 3', function() {
        var number = parser.parse("-1.5");
        var result = Functions.exp(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Exp result: " + formatter.format(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([3,9,8,2,8,9,2,4,8,4,1,0,6,1,0,3,1,3,2,2]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate exponent 4', function() {
        var number = parser.parse("0.12345");
        var result = Functions.exp(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Exp result: " + formatter.format(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([6,6,4,5,5,0,4,1,6,5,4,3,3,4,3,9,3,1,3,1,1]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate exponent 5', function() {
        var number = parser.parse("0");
        var result = Functions.exp(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Exp result: " + formatter.format(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1]);
        expect(result.getScale()).to.equal(0);
    });

});
