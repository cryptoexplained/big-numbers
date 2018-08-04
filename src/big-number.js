'use strict';

var Constants = require('./constants');
var Comparator = require('./comparator');
var NumberUtils = require('./number-utils');
var Validators = require('./validators');

module.exports = function(sign, value, scale, precision, roundingMode) {

    Validators.validateSign(sign);
    Validators.validateValue(value);
    Validators.validateScale(scale);
    Validators.validatePrecision(precision);
    Validators.validateRoundingMode(roundingMode);

    value = value.slice();

    var Arithmetic = require('./arithmetic');
    var Functions = require('./functions');
    var Trigonometry = require('./trigonometry');

    var normalizedScale = scale;
    while(normalizedScale < 0) {
        value.unshift(0);
        normalizedScale++;
    }

    var numberOfLeadingZeros = 0;
    for(var i = value.length - 1; i > 0; i--) {
        if(value[i] !== 0) {
            break;
        }
        numberOfLeadingZeros++;
    }
    if(numberOfLeadingZeros > 0) {
        value = value.slice(0, value.length - numberOfLeadingZeros);
    }

    if(normalizedScale > precision) {
        var roundLeftover = NumberUtils.getRoundingLeftOver(sign, value, normalizedScale, precision, roundingMode);
        value = value.slice(normalizedScale - precision);
        normalizedScale = precision;
        if(roundLeftover > 0) {
            var leftover = roundLeftover;
            for(var i = 0; i < value.length && leftover > 0; i++) {
                var digit = value[i];
                var sum = digit + leftover;
                if(sum >= 10) {
                    leftover = 1;
                    sum = sum - 10;
                } else {
                    leftover = 0;
                }
                value[i] = sum;
            }
            if(leftover > 0) {
                value.push(leftover);
            }
        }
    }

    var numberOfTrailingZero = 0;
    for(var i = 0; (i < (value.length - 1) && i < normalizedScale); i++) {
        if(value[i] !== 0) {
            break;
        }
        numberOfTrailingZero++;
    }
    if(numberOfTrailingZero > 0) {
        value = value.slice(numberOfTrailingZero);
        normalizedScale = normalizedScale - numberOfTrailingZero;
    }

    var _sign = sign;
    var _value = value;
    var _scale = normalizedScale;
    var _precision = precision;
    var _roundingMode = roundingMode;

    this.getSign = function() {
        return _sign;
    };

    this.getValue = function() {
        return _value;
    };

    this.getScale = function() {
        return _scale;
    };

    this.getPrecision = function() {
        return _precision;
    };

    this.getRoundingMode = function() {
        return _roundingMode;
    };

    this.add = function(summable, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Arithmetic.add(this, summable, precisionToUse, roundingModeToUse);
    };

    this.subtract = function(subtrahend, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Arithmetic.subtract(this, subtrahend, precisionToUse, roundingModeToUse);
    };

    this.multiply = function(multiplier, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Arithmetic.multiply(this, multiplier, precisionToUse, roundingModeToUse);
    };

    this.divide = function(divider, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Arithmetic.divide(this, divider, precisionToUse, roundingModeToUse);
    };

    this.mod = function(number) {

    };

    this.abs = function() {
        return Arithmetic.abs(this);
    };

    this.invert = function() {
        return Arithmetic.invert(this);
    };

    this.shift = function(shift, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Arithmetic.shift(this, shift, precisionToUse, roundingModeToUse);
    };

    this.compareTo = function(other) {
        return Comparator.compare(this, other);
    };

    this.equals = function(other) {
        return Comparator.compare(this, other) == 0;
    };

    this.greaterThan = function(other) {
        return Comparator.compare(this, other) > 0;
    };

    this.lessThan = function(other) {
        return Comparator.compare(this, other) < 0;
    };

    this.greaterOrEquals = function(other) {
        return Comparator.compare(this, other) >= 0;
    };

    this.lessOrEquals = function(other) {
        return Comparator.compare(this, other) <= 0;
    };

    this.isZero = function() {
        return Comparator.isZero(this);
    };

    this.isPositive = function() {
        return _sign === Constants.POSITIVE;
    };

    this.isNegative = function() {
        return _sign === Constants.NEGATIVE;
    };

    this.isInteger = function() {
        return (scale <= 0);
    };

    this.toInteger = function() {
        return Arithmetic.integerValue(this);
    };

    this.toPrecision = function(precision, roundingMode) {
        Validators.validatePrecision(precision);
        if(roundingMode) {
            Validators.validateRoundingMode(roundingMode);
        }
        var roundingModeToUse = roundingMode ? roundingMode : this.getRoundingMode();
        return Arithmetic.toPrecision(this, precision, roundingModeToUse);
    };

    this.withRoundingMode = function(roundingMode) {
        Validators.validateRoundingMode(roundingMode);
        return Arithmetic.withRoundingMode(this, roundingMode);
    };

    this.exp = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Functions.exp(this, precisionToUse, roundingModeToUse);
    };

    this.log = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Functions.log(this, precisionToUse, roundingModeToUse);
    };

    this.lg = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Functions.lg(this, precisionToUse, roundingModeToUse);
    };

    this.pow = function(power, precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Functions.pow(this, power, precisionToUse, roundingModeToUse);
    };

    this.sqrt = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Functions.sqrt(power, precisionToUse, roundingModeToUse);
    };

    this.cos = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Trigonometry.cos(this, precisionToUse, roundingModeToUse);
    };

    this.sin = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Trigonometry.sin(this, precisionToUse, roundingModeToUse);
    };

    this.tan = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Trigonometry.tan(this, precisionToUse, roundingModeToUse);
    };

    this.ctan = function(precision, roundingMode) {
        validatePrecisionAndRoundingModeIfProvided(precision, roundingMode);
        var precisionToUse = precision ? precision : _precision;
        var roundingModeToUse = roundingMode ? roundingMode : _roundingMode;
        return Trigonometry.ctan(this, precisionToUse, roundingModeToUse);
    };

    this.clone = function() {
        return arithmetic.clone(this);
    };

    this.toNumber = function() {
        var number = 0;
        for(var i = _value.length - 1; i >= 0; i--) {
            number += value[i] * Math.pow(10, i - _scale);
        }
        return number * _sign;
    };

    this.toJSON = function() {
      return "{" +
          "sign: " + _sign + ", " +
          "value: [" + _value + "], " +
          "scale: " + _scale + ", " +
          "precision: " + _precision + ", " +
          "roundingMode: " + roundingMode +
      "}";
    };
};

function validatePrecisionAndRoundingModeIfProvided(precision, roundingMode) {
    if(precision) {
        Validators.validatePrecision(precision);
    }
    if(roundingMode) {
        Validators.validateRoundingMode(roundingMode);
    }
}
