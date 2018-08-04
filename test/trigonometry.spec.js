'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');
var Parser = require('../src/parser');
var Trigonometry = require('../src/trigonometry');

describe('Trigonometry Specification', function() {

    var parser;

    beforeEach(function() {
        parser = new Parser({
            decimalSeparator: '.',
            thousandsSeparator: undefined,
            precision: 20,
            roundingMode: Constants.ROUNDING_MODE_HALF_UP
        });
    });

    it('should calculate cos positive [0; Pi/2]', function() {
        var number = parser.parse("1.5");
        var result = Trigonometry.cos(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9,0,0,1,9,2,0,7,7,6,6,1,0,2,7,3,7,0,7]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate cos positive [Pi/2; Pi]', function() {
        var number = parser.parse("2.5");
        var result = Trigonometry.cos(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([3,8,4,1,7,3,3,9,6,4,5,5,1,6,3,4,1,1,0,8]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate cos negative [0; Pi/2]', function() {
        var number = parser.parse("-1.5");
        var result = Trigonometry.cos(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9,0,0,1,9,2,0,7,7,6,6,1,0,2,7,3,7,0,7]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate cos [> 2 Pi]', function() {
        var number = parser.parse("26.632741228718345907701147066236");
        var result = Trigonometry.cos(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([9,0,0,1,9,2,0,7,7,6,6,1,0,2,7,3,7,0,7]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate sin', function() {
        var number = parser.parse("0.5");
        var result = Trigonometry.sin(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([7,2,0,0,0,3,0,2,4,0,6,8,3,5,5,2,4,9,7,4]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate tan', function() {
        var number = parser.parse("1.5");
        var result = Trigonometry.tan(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.POSITIVE);
        expect(result.getValue()).to.eql([5,6,7,8,3,9,1,7,1,7,1,7,4,9,9,1,4,1,0,1,4,1]);
        expect(result.getScale()).to.equal(20);
    });

    it('should calculate ctan', function() {
        var number = parser.parse("-1.5");
        var result = Trigonometry.ctan(number, 20, Constants.ROUNDING_MODE_HALF_UP);
        console.log("result: " + result.toJSON());
        expect(result.getSign()).to.equal(Constants.NEGATIVE);
        expect(result.getValue()).to.eql([9,7,8,4,4,2,5,6,2,0,3,4,4,8,4,1,9,0,7]);
        expect(result.getScale()).to.equal(20);
    });

});
