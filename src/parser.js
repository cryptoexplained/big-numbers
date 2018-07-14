'use strict';

var Constants = require('./constants');
var BigNumber = require('./big-number');

module.exports = function(defaultConfig) {

    var self = this;

    var _config = defaultConfig;

    this.parse = function(value, config) {
        var configToUse = config ? config : _config;
        if((typeof value) === 'string') {
            return parseStringWithExponent(value, configToUse);
        } else if((typeof value) === 'number') {
            return parseStringWithExponent(value.toString(), configToUse);
        } else {
            throw 'Illegal input [' + input + '] of type [' + (typeof value) + ']. Only string or number types can be parsed';
        }
    };
};

function parseStringWithExponent(input, config) {
    if(!input || input.length <= 0) {
        throw 'Cannot parse empty input';
    }
    var parts = input.toLowerCase().split('e');
    if(!parts || parts.length < 1 || parts.length > 2) {
        throw '1 Non parsable input [' + input + ']';
    }
    if(!parts[0] || parts[0].length <= 0) {
        throw '2 Non parsable input [' + input + ']';
    }
    if(parts.length === 1) {
        return parseString(parts[0], config);
    } else {
        var onlyDigitsRegExp = new RegExp('^[+,-]?[0-9]+$');
        if(!parts[1] || parts[1].length <= 0 || !onlyDigitsRegExp.test(parts[1])) {
            throw '3 Non parsable input [' + input + ']';
        }
        var mantissa = parseString(parts[0], config);
        var exponent = parseInt(parts[1], 10);
        var scaleAfterShift = mantissa.getScale() - exponent;
        var precisionToUse = scaleAfterShift > Constants.DEFAULT_PRECISION ? scaleAfterShift : Constants.DEFAULT_PRECISION;
        return mantissa.shift(exponent, precisionToUse, Constants.DEFAULT_ROUNDING_MODE);
    }
}

function parseString(input, config) {

    var sign = Constants.POSITIVE;
    var digits = [];
    var scale = 0;

    var firstSymbol = input.charAt(0);
    var startIteration = 0;
    if(firstSymbol === Constants.PLUS) {
        startIteration = 1;
        sign = Constants.POSITIVE;
    } else if(firstSymbol === Constants.MINUS) {
        startIteration = 1;
        sign = Constants.NEGATIVE;
    }

    if(input.length - startIteration <= 0) {
        throw 'Non parsable input [' + input + ']';
    }

    for(var i = input.length - 1; i >= startIteration; i--) {
        var symbol = input.charAt(i);
        if(isDecimalSeparator(symbol, config)) {
            if(scale > 0) {
                throw 'Unexpected decimal separator at position [' + (input.length - i - 1) + ']';
            }
            scale = input.length - i - 1;
        } else if(!isThousandsSeparator(symbol, config)) {
            var digit = parseInt(symbol, 10);
            if(isNaN(digit)) {
                throw 'Non parsable symbol [' + symbol + '] at position [' + (input.length - i - 1) + '] of input string [' + input + ']';
            }
            digits.push(digit);
        }
    }
    var precisionToUse = scale > Constants.DEFAULT_PRECISION ? scale : Constants.DEFAULT_PRECISION;
    var result = new BigNumber(sign, digits, scale, precisionToUse, Constants.DEFAULT_ROUNDING_MODE);
    return result;
}

function isDecimalSeparator(symbol, config) {
    return config.decimalSeparator === symbol;
}

function isThousandsSeparator(symbol, config) {
    return config.thousandsSeparator === symbol;
}
