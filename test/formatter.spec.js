'use strict';

var expect = require('chai').expect;
var Constants = require('../src/constants');;
var Formatter = require('../src/formatter');
var Parser = require('../src/parser');

describe('Formatter Specification', function() {

    var formatter;
    var parser;

    var defaultConfig = {
        decimalSeparator: '.',
        thousandsSeparator: undefined,
        precision: 20,
        roundingMode: Constants.ROUNDING_MODE_HALF_UP
    };

    beforeEach(function() {
        formatter = new Formatter(defaultConfig);
        parser = new Parser(defaultConfig);
    });

    it('should format positive number', function() {
        var number = parser.parse("1.23456789");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("1.23456789");
    });

    it('should format negative number', function() {
        var number = parser.parse("-1.23456789");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("-1.23456789");
    });

    it('should format number less than one #1', function() {
        var number = parser.parse("0.000001");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("0.000001");
    });

    it('should format number less than one #2', function() {
        var number = parser.parse("-0.50001");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("-0.50001");
    });

    it('should format integer number #1', function() {
        var number = parser.parse("1");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("1");
    });

    it('should format integer number #2', function() {
        var number = parser.parse("-10000");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("-10000");
    });

    it('should format floating number #1', function() {
        var number = parser.parse("-12345.06789");
        var formatted = formatter.format(number);
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("-12345.06789");
    });

    it('should format using custom config #1', function() {
        var number = parser.parse("12345.6789");
        var formatted = formatter.format(number, {decimalSeparator: ','});
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("12345,6789");
    });

    it('should format using custom config #2', function() {
        var number = parser.parse("123456.789");
        var formatted = formatter.format(number, {decimalSeparator: ',', thousandsSeparator: '.'});
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.456,789");
    });

    it('should format using custom config #3', function() {
        var number = parser.parse("1234567.89");
        var formatted = formatter.format(number, {decimalSeparator: ',', thousandsSeparator: '.'});
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("1.234.567,89");
    });

    it('should format with digits after decimal separator limitations #1', function() {
        var number = parser.parse("123.456789");
        var formatted = formatter.format(number, {
            formatting: {
                maxAfterDot: 2,
                minAfterDot: 2
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.45");
    });

    it('should format with digits after decimal separator limitations #2', function() {
        var number = parser.parse("-123.456789");
        var formatted = formatter.format(number, {
            formatting: {
                maxAfterDot: 6,
                minAfterDot: 6
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("-123.456789");
    });

    it('should format with digits after decimal separator limitations #3', function() {
        var number = parser.parse("123");
        var formatted = formatter.format(number, {
            formatting: {
                minAfterDot: 3
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.000");
    });

    it('should format with digits after decimal separator limitations #4', function() {
        var number = parser.parse("123.45");
        var formatted = formatter.format(number, {
            formatting: {
                minAfterDot: 3,
                maxAfterDot: 5
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.450");
    });

    it('should format with digits after decimal separator limitations #5', function() {
        var number = parser.parse("123.000045");
        var formatted = formatter.format(number, {
            formatting: {
                maxAfterDot: 3
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123");
    });

    it('should format with digits after decimal separator limitations #6', function() {
        var number = parser.parse("123.000045");
        var formatted = formatter.format(number, {
            formatting: {
                minAfterDot: 2,
                maxAfterDot: 3
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.00");
    });

    it('should format with digits after decimal separator limitations #7', function() {
        var number = parser.parse("123.400005");
        var formatted = formatter.format(number, {
            formatting: {
                maxAfterDot: 3
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.4");
    });

    it('should format with digits after decimal separator limitations #8', function() {
        var number = parser.parse("123.400005");
        var formatted = formatter.format(number, {
            formatting: {
                minAfterDot: 2,
                maxAfterDot: 3
            }
        });
        console.log('Formatted: ' + formatted);
        expect(formatted).to.eql("123.40");
    });

});
