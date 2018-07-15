'use strict';

var Constants = require('./constants');
var Comparator = require('./comparator');
var BigNumber = require('./big-number');
var CalculationUtils = require('./calculation-utils');

var ITERATIONS_LIMIT = 500;

var LOG2 = new BigNumber(Constants.POSITIVE, [2,8,5,4,1,2,1,2,3,2,7,1,4,9,0,3,5,4,9,9,5,5,0,8,1,7,4,1,3,9,6], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG3 = new BigNumber(Constants.POSITIVE, [5,2,2,9,6,3,2,5,4,2,5,9,3,1,9,6,9,0,1,8,6,6,8,8,2,2,1,6,8,9,0,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG4 = new BigNumber(Constants.POSITIVE, [4,6,1,9,2,4,2,4,6,4,4,3,8,8,1,6,0,9,8,9,1,1,1,6,3,4,9,2,6,8,3,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG5 = new BigNumber(Constants.POSITIVE, [2,6,2,2,3,3,3,9,5,7,0,0,6,4,7,3,0,0,1,4,3,4,2,1,9,7,3,4,9,0,6,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG6 = new BigNumber(Constants.POSITIVE, [7,0,8,3,8,5,3,7,7,4,2,1,8,0,0,0,5,5,0,8,2,2,9,6,4,9,5,7,1,9,7,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG7 = new BigNumber(Constants.POSITIVE, [2,3,4,4,3,4,7,2,5,3,5,0,1,5,0,3,3,1,3,5,5,0,9,4,1,0,1,9,5,4,9,1], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG8 = new BigNumber(Constants.POSITIVE, [5,4,7,3,4,6,3,6,9,6,1,5,2,8,2,9,5,3,8,9,7,6,1,4,5,1,4,4,9,7,0,2], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG9 = new BigNumber(Constants.POSITIVE, [1,5,4,8,3,7,4,0,9,4,0,9,7,2,8,3,9,1,2,6,3,3,7,7,5,4,2,2,7,9,1,2], 31, 31, Constants.ROUNDING_MODE_HALF_UP);
var LOG10 = new BigNumber(Constants.POSITIVE, [4,4,8,6,4,5,4,1,9,9,7,1,0,4,8,6,5,4,0,4,9,9,2,9,0,5,8,5,2,0,3,2], 31, 31, Constants.ROUNDING_MODE_HALF_UP);

var LOG_TABLE = [LOG2, LOG3, LOG4, LOG5, LOG6, LOG7, LOG8, LOG9, LOG10];

var E10 = new BigNumber(Constants.POSITIVE, [4,8,2,5,4,6,0,0,9,7,5,9,6,1,5,6,1,7,6,0,8,4,9,7,5,6,4,6,2,0,2,2], 27, 31, Constants.ROUNDING_MODE_HALF_UP);
var E = new BigNumber(Constants.POSITIVE, [7,2,5,3,1,7,4,7,8,2,0,6,3,5,3,2,5,4,0,9,5,4,8,2,8,1,8,2,8,1,7,2], 31, 31, Constants.ROUNDING_MODE_HALF_UP);

module.exports = {

    E: E,

    exp: function(pow, precision, roundingMode) {
        var invert = false;
        if(pow.isZero()) {
            return new BigNumber(Constants.POSITIVE, [1], 0, precision, roundingMode);
        }
        if(pow.isNegative()) {
            invert = true;
            pow = pow.abs();
        }
        var requiredPrecision = precision + 3;
        var tensCounter = 0;
        var shiftedValue = pow;
        if(Comparator.compareAbsoluteValues(pow, new BigNumber(Constants.POSITIVE, [0, 1], 0, precision, roundingMode)) >= 0) {
            var divideBy10Result = pow.shift(-1, 0, Constants.ROUNDING_MODE_DOWN).toInteger();
            shiftedValue = pow.subtract(divideBy10Result.shift(1));
            tensCounter = divideBy10Result.toNumber();
        }

        var one = new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode);
        var accumulator = new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode);
        if(!shiftedValue.isZero()) {
            var tailorMember = one;
            for(var i = 1; i <= ITERATIONS_LIMIT; i++) {
                tailorMember = tailorMember.multiply(shiftedValue).divide(i);
                accumulator = accumulator.add(tailorMember);
                if(CalculationUtils.isRequiredPrecision(tailorMember, precision + 1)) {
                    break;
                }
            }
        }
        if(tensCounter > 0) {
            for(var i = 0; i < tensCounter; i++) {
                accumulator = accumulator.multiply(E10);
            }
        }
        if(invert) {
            return one.divide(accumulator).toPrecision(precision, roundingMode);
        } else {
            return accumulator.toPrecision(precision, roundingMode);
        }
    },

    log: function(value, precision, roundingMode) {
        var calculationPrecision = precision + 1;
        if(value.isNegative() || value.isZero()) {
            throw 'Cannot calculate logarithm from negative or zero value';
        }
        var one = new BigNumber(Constants.POSITIVE, [1], 0, calculationPrecision, roundingMode);
        if(value.equals(one)) {
            return new BigNumber(Constants.POSITIVE, [0], 0, precision, roundingMode);
        }
        var valueLength = value.getValue().length;
        var valueScale = value.getScale();
        var shift = valueScale - valueLength + 1;
        var shiftedValue = shift != 0 ? value.shift(shift, calculationPrecision, roundingMode) : value;

        var mostSignificantDigit = value.getValue()[valueLength - 1];
        if(mostSignificantDigit >= 2) {
            shiftedValue = shiftedValue.divide(mostSignificantDigit, calculationPrecision, roundingMode);
        }
        var logValue = calculateLog(shiftedValue, calculationPrecision, roundingMode);
        if(mostSignificantDigit >= 2) {
            logValue = logValue.add(LOG_TABLE[mostSignificantDigit - 2].toPrecision(calculationPrecision, roundingMode));
        }
        var shiftCompensation = LOG10.toPrecision(calculationPrecision, roundingMode).multiply(-shift);
        logValue = logValue.add(shiftCompensation);
        return logValue.toPrecision(precision, roundingMode);
    },

    pow: function(value, power, precision, roundingMode) {
        power = CalculationUtils.toBigNumber(power, precision, roundingMode);
        if(power.isZero()) {
            return new BigNumber(Constants.POSITIVE, [1], 0, precision, roundingMode);
        }
        if(value.isZero()) {
            return new BigNumber(Constants.POSITIVE, [0], 0, precision, roundingMode);
        }
        if(value.isNegative()) {
            throw 'Cannot calculate power of negative value';
        }
        var invert = false;
        if(power.isNegative()) {
            invert = true;
            power = power.abs();
        }
        var requiredPrecision = precision + 3;
        var result = power.multiply(value.log(requiredPrecision, roundingMode), requiredPrecision, roundingMode).exp(requiredPrecision, roundingMode);
        if(invert) {
            return (new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode)).divide(result).toPrecision(precision, roundingMode);
        } else {
            return result.toPrecision(precision, roundingMode);
        }
    },

    lg: function(value, precision, roundingMode) {
        var requiredPrecision = precision + 1;
        var naturalLog = value.log(requiredPrecision, roundingMode);
        return naturalLog.divide(LOG10, requiredPrecision, roundingMode).toPrecision(precision, roundingMode);
    },

    sqrt: function(value, precision, roundingMode) {
        return value.pow(new BigNumber(Constants.POSITIVE, [5], 1, precision, roundingMode));
    }
};

function calculateLog(value, precision, roundingMode) {
    var one = new BigNumber(Constants.POSITIVE, [1], 0, precision, roundingMode);
    if(value.equals(one)) {
        return new BigNumber(Constants.POSITIVE, [0], 0, precision, roundingMode);
    }
    var sign = 1;
    var requiredPrecision = precision + 3;
    var accumulator = new BigNumber(Constants.POSITIVE, [0], 0, requiredPrecision, roundingMode);
    var tailorMember = new BigNumber(Constants.POSITIVE, [1], 0, requiredPrecision, roundingMode);
    var arg = value.subtract(one, requiredPrecision, roundingMode);
    for(var i = 1; i <= ITERATIONS_LIMIT; i++) {
        tailorMember = tailorMember.multiply(arg);
        if(sign > 0) {
            accumulator = accumulator.add(tailorMember.divide(i));
        } else {
            accumulator = accumulator.subtract(tailorMember.divide(i));
        }
        if(CalculationUtils.isRequiredPrecision(tailorMember, precision + 1)) {
            return accumulator.toPrecision(precision);
        }
        sign = sign * -1;
    }
    return accumulator.toPrecision(precision);
}
