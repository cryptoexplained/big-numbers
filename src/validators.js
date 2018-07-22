'use strict';

var Constants = require('./constants');

module.exports = {

    validateSign: function(input) {
        if(input !== Constants.POSITIVE && input !== Constants.NEGATIVE) {
            throw 'Illegal sign value [' + input + ']. Please provide valid sign: ' + Constants.POSITIVE + ' for positive or ' + Constants.NEGATIVE + ' for negative';
        }
    },

    validateValue: function(input) {
        if(!Array.isArray(input)) {
            throw 'Illegal value type. Only array type is supported';
        }
        if(!input || input.length <= 0) {
            throw 'Illegal empty array value';
        }
        for(var i = 0; i < input.length; i++) {
            var dg = input[i];
            if((typeof dg) != 'number') {
                throw 'Only numbers are allowed';
            }
            if(!Number.isInteger(dg)) {
                throw 'Only integer values are allowed';
            }
            if(dg < 0 || dg >= 10) {
                throw 'Numbers should be in range from 0 to 9';
            }
        }
    },

    validateScale: function(input) {
        if((typeof input) != 'number') {
            throw 'Scale should be number type';
        }
        if(!Number.isInteger(input)) {
            throw 'Only integer scale value is supported';
        }
    },

    validatePrecision: function(input) {
        if((typeof input) != 'number') {
            throw 'Precision should be number type';
        }
        if(!Number.isInteger(input)) {
            throw 'Only integer precision value is supported';
        }
    },

    validateRoundingMode: function(input) {
        if(input !== Constants.ROUNDING_MODE_UP
                && input !== Constants.ROUNDING_MODE_DOWN
                && input !== Constants.ROUNDING_MODE_CEIL
                && input !== Constants.ROUNDING_MODE_FLOOR
                && input !== Constants.ROUNDING_MODE_HALF_UP
                && input !== Constants.ROUNDING_MODE_HALF_DOWN
                && input !== Constants.ROUNDING_MODE_HALF_EVEN) {
            throw 'Illegal rounding mode';
        }
    },

    validateDecimalSeparator: function(input) {
        if(!input) {
            throw 'Decimal separator should be defined';
        }
        if((typeof input) !== 'string') {
            throw 'Decimal separator should be string type';
        }
        if(input.length <= 0) {
            throw 'Decimal separator should nit be blank';
        }
    },

    validateThousandsSeparator: function(input) {
        if(input === undefined || input === null) {
            return;
        }
        if((typeof input) !== 'string') {
            throw 'Decimal separator should be string type';
        }
    },

    validateConfigurationFormatting: function(input) {
        if(input.minAfterDot !== undefined && input.minAfterDot !== null && (typeof input.minAfterDot) !== 'number'
                || input.minAfterDot < 0) {
            throw 'Minimal number of digits after decimal separator should be positive number';
        }
        if(input.maxAfterDot !== undefined && input.maxAfterDot !== null && (typeof input.maxAfterDot) !== 'number'
                || input.maxAfterDot < 0) {
            throw 'Maximal number of digits after decimal separator should be positive number';
        }
        if(input.minAfterDot && input.maxAfterDot) {
            if(input.minAfterDot > input.maxAfterDot) {
                throw 'Minimal number of digits after decimal separator should be greater or equals to maximal';
            }
        }
    }
};
