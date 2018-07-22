'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');
var Formatter = require('../src/formatter');
var Functions = require('../src/functions');

describe('Logarithm Specification', function() {

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

    it('should calculate natural logarithm 1', function() {
        var number = parser.parse("0.000000291345");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([1,2,3,0,3,5,0,2,4,9,9,4,0,7,7,5,7,8,4,0,5,1]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 2', function() {
        var number = parser.parse("0.000101");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([2,2,3,5,6,4,1,0,3,2,1,1,4,0,0,9,3,0,0,2,9]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 3', function() {
        var number = parser.parse("0.3");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([2,6,2,9,9,5,3,9,5,2,3,4,0,8,2,7,9,3,0,2,1]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 4', function() {
        var number = parser.parse("40");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([5,8,2,0,3,6,3,9,3,1,1,4,5,4,9,7,8,8,8,6,3]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 5', function() {
        var number = parser.parse("1");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([0]);
        expect(result.getScale()).to.equal(0);
    });

    it('should calculate natural logarithm 6', function() {
        var number = parser.parse("5.5555");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9,4,2,4,3,6,2,9,1,4,0,8,2,4,8,8,7,4,1,7,1]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 7', function() {
        var number = parser.parse("987654321");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([5,8,2,0,0,4,5,3,0,6,9,6,1,3,3,4,8,0,1,7,0,2]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 8', function() {
        var number = parser.parse("77.88");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([7,8,6,3,9,8,9,9,3,0,5,0,8,1,9,6,1,5,5,3,4]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 9', function() {
        var number = parser.parse("0.0000000000601");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([6,9,2,1,3,6,8,3,7,8,3,4,7,2,1,1,0,5,3,5,3,2]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate natural logarithm 10', function() {
        var number = parser.parse("888");
        var result = Functions.log(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([2,0,4,6,0,0,7,1,2,9,9,2,4,7,1,7,9,8,8,7,6]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate base 10 logarithm 1', function() {
        var number = parser.parse("100");
        var result = Functions.lg(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log10 result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([2]);
        expect(result.getScale()).to.equal(0);
    });

    it('should calculate base 10 logarithm 2', function() {
        var number = parser.parse("0.01");
        var result = Functions.lg(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Log10 result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([2]);
        expect(result.getScale()).to.equal(0);
    });
});
