'use strict';

var Constants = require('./constants');
var BigNumber = require('./big-number');
var CalculationUtils = require('./calculation-utils');

var PI = new BigNumber(Constants.POSITIVE, [5,9,7,2,3,8,3,3,4,6,2,6,4,8,3,2,3,9,7,9,8,5,3,5,6,2,9,5,1,4,1,3], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var HALF_PI = new BigNumber(Constants.POSITIVE, [8,9,3,6,1,9,6,1,2,3,1,3,2,9,1,6,6,9,8,4,9,7,6,2,3,6,9,7,0,7,5,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var TWO_PI = new BigNumber(Constants.POSITIVE, [9,5,5,6,6,7,6,8,2,5,2,9,6,7,4,6,8,5,9,7,1,7,0,3,5,8,1,3,8,2,6], 30, 30, Constants.ROUNDING_MODE_HALF_UP);
var ITERATIONS_LIMIT = 500;

module.exports = {

    PI: PI,
    HALF_PI: HALF_PI,
    TWO_PI: TWO_PI,

    sin: function(number, precision, roundingMode) {
        number = number.subtract(HALF_PI);
        return this.cos(number, precision, roundingMode);
    },

    cos: function(number, precision, roundingMode) {
        var invertResult = false;
        if(number.isNegative()) {
            number = number.abs();
        }
        if(number.greaterThan(TWO_PI)) {
            var twoPiRate = number.divide(TWO_PI, precision, Constants.ROUNDING_MODE_DOWN).toInteger();
            number = number.subtract(twoPiRate.multiply(TWO_PI));
        }
        if(number.greaterThan(PI)) {
            invertResult = !invertResult;
            number = number.subtract(PI);
        }
        var requiredPrecision = precision + 2;
        number = number.toPrecision(requiredPrecision, roundingMode);
        var tailorMember = new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode);
        var accumulator = new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode);
        var number2 = number.multiply(number);
        var sign = -1;
        for(var i = 1; i <= ITERATIONS_LIMIT; i++) {
            tailorMember = tailorMember.multiply(number2).divide((2 * i - 1) * 2 * i);
            if(sign == Constants.NEGATIVE) {
                accumulator = accumulator.subtract(tailorMember);
            } else {
                accumulator = accumulator.add(tailorMember);
            }
            if(CalculationUtils.isRequiredPrecision(tailorMember, precision + 1)) {
                return invertResult ? accumulator.toPrecision(precision).invert() : accumulator.toPrecision(precision);
            }
            sign = sign * -1;
        }
        return invertResult ? accumulator.toPrecision(precision).invert() : accumulator.toPrecision(precision);
    },

    tan: function(number, precision, roundingMode) {
        var requiredPrecision = precision + 2;
        var result = this.sin(number, requiredPrecision, roundingMode).divide(this.cos(number, requiredPrecision, roundingMode));
        return result.toPrecision(precision);
    },

    ctan: function(number, precision, roundingMode) {
        var requiredPrecision = precision + 2;
        var result = this.cos(number, requiredPrecision, roundingMode).divide(this.sin(number, requiredPrecision, roundingMode));
        return result.toPrecision(precision);
    }
};
