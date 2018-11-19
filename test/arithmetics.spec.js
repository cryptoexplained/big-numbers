'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');
var Arithmetic = require('../src/arithmetic');

describe('Arithmetic Specification', function() {

    var parser;

    beforeEach(function() {
        parser = new Parser({
            decimalSeparator: '.',
            thousandsSeparator: undefined,
            precision: 20,
            roundingMode: Constants.ROUNDING_MODE_HALF_UP
        });
    });

    it('should add two positive numbers', function() {
        var first = parser.parse("1.1111");
        var second = parser.parse("1111.1");
        var result = Arithmetic.add(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Add result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(1);
        expect(result.getValue()).to.eql([1, 1, 1, 2, 2, 1, 1, 1]);
        expect(result.getScale()).to.equal(4);
    });

    it('should add two negative numbers', function() {
        var first = parser.parse("-1.1111");
        var second = parser.parse("-1111.1");
        var result = Arithmetic.add(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Add result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(-1);
        expect(result.getValue()).to.eql([1, 1, 1, 2, 2, 1, 1, 1]);
        expect(result.getScale()).to.equal(4);
    });

    it('should add positive and negative numbers', function() {
        var first = parser.parse("-934.82636");
        var second = parser.parse("1212.1212");
        var result = Arithmetic.add(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Add result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(1);
        expect(result.getValue()).to.eql([4, 8, 4, 9, 2, 7, 7, 2]);
        expect(result.getScale()).to.equal(5);
    });

    it('should subtract two positive numbers (positive result)', function() {
        var first = parser.parse("12.3456");
        var second = parser.parse("1.789");
        var result = Arithmetic.subtract(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Sub result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(1);
        expect(result.getValue()).to.eql([6, 6, 5, 5, 0, 1]);
        expect(result.getScale()).to.equal(4);
    });

    it('should subtract two positive numbers (negative result)', function() {
        var first = parser.parse("1.789");
        var second = parser.parse("12.3456");
        var result = Arithmetic.subtract(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Sub result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(-1);
        expect(result.getValue()).to.eql([6, 6, 5, 5, 0, 1]);
        expect(result.getScale()).to.equal(4);
    });

    it('should multiply two positive numbers', function() {
        var first = parser.parse("123.777");
        var second = parser.parse("789.077");
        var result = Arithmetic.multiply(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Multiplication result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9, 2, 8, 3, 8, 5, 9, 6, 6, 7, 9]);
        expect(result.getScale()).to.equal(6);
    });

    it('should divide two positive numbers', function() {
        var first = parser.parse("256999");
        var second = parser.parse("49");
        var result = Arithmetic.divide(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Division result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([1,3,5,6,2,3,6,1,8,0,4,0,2,0,1,5,5,7,7,8,4,4,2,5]);
        expect(result.getScale()).to.equal(20);
    });

    it('should divide two negative numbers', function() {
        var first = parser.parse("-4");
        var second = parser.parse("-2");
        var result = Arithmetic.divide(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Division result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([2]);
        expect(result.getScale()).to.equal(0);
    });

    it('should divide positive number by negative number', function() {
        var first = parser.parse("0.015");
        var second = parser.parse("-0.0003");
        var result = Arithmetic.divide(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Division result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([0, 5]);
        expect(result.getScale()).to.equal(0);
    });

    it('should divide negative number by positive number', function() {
        var first = parser.parse("-0.020");
        var second = parser.parse("0.4");
        var result = Arithmetic.divide(first, second, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Division result: " + JSON.stringify(result));
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([5]);
        expect(result.getScale()).to.equal(2);
    });

    it('should divide in correct precision, 10000 if needed', function() {
        var first = parser.parse("1");
        var second = parser.parse("3");
        var result = Arithmetic.divide(first, second, 10000, Constants.ROUNDING_MODE_HALF_UP);
        console.log("Division result: " + JSON.stringify(result));
        expect(result.getValue().length).to.equal(10000);
    });

});
