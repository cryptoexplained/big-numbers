'use strict';

var expect = require('chai').expect;
var Formatter = require('../src/formatter');
var Parser = require('../src/parser');

describe('Formatter Specification', function() {

    var formatter;
    var parser;

    var defaultConfig = {
        decimalSeparator: '.',
        thousandsSeparator: undefined
    };

    beforeEach(function() {
        formatter = new Formatter(defaultConfig);
        parser = new Parser(defaultConfig);
    });

    it('should format positive number with default pattern', function() {
        var number = parser.parse("1.23456789");
        var formatted = formatter.format(number);
        expect(formatted).to.eql("1.23456789");
    });

    it('should format negative number with default pattern', function() {
        var number = parser.parse("-1.23456789");
        var formatted = formatter.format(number);
        expect(formatted).to.eql("-1.23456789");
    });

});
