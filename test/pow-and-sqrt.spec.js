'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');
var Formatter = require('../src/formatter');
var Functions = require('../src/functions');

describe('Pow and Sqrt Specification', function() {

    var parser;
    var formatter;
    var defaultConfig = {
        decimalSeparator: '.',
        thousandsSeparator: undefined
    };

    beforeEach(function() {
        parser = new Parser(defaultConfig);
        formatter = new Formatter(defaultConfig);
    });

    it('should calculate pow 2^2', function() {
        var number = parser.parse("2");
        var result = Functions.pow(number, 2, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Pow result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([4]);
        expect(result.getScale()).to.equal(0);
    });

    it('should calculate pow 4^4', function() {
        var number = parser.parse("4");
        var result = Functions.pow(number, 4, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Pow result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([6,5,2]);
        expect(result.getScale()).to.equal(0);
    });

    it('should calculate pow 10^-10', function() {
        var number = parser.parse("10");
        var result = Functions.pow(number, -10, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Pow result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1]);
        expect(result.getScale()).to.equal(10);
    });

    it('should calculate sqrt(25)', function() {
        var number = parser.parse("25");
        var result = Functions.sqrt(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Sqrt result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([5]);
        expect(result.getScale()).to.equal(0);
    });

    it('should calculate sqrt(0.25)', function() {
        var number = parser.parse("0.0025");
        var result = Functions.sqrt(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Sqrt result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([5]);
        expect(result.getScale()).to.equal(2);
    });
});

