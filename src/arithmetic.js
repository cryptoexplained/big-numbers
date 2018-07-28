'use strict';

var Constants = require('./constants');
var NumberUtils = require('./number-utils');
var Comparator = require('./comparator');
var BigNumber = require('./big-number');
var CalculationUtils = require('./calculation-utils');

module.exports = {

    add: function(first, second, precision, roundingMode) {
        second = CalculationUtils.toBigNumber(second);
        if(first.getSign() === second.getSign()) {
            return addAbsoluteValues(first.getSign(), first, second, precision, roundingMode);
        }
        var compareResult = Comparator.compareAbsoluteValues(first, second);
        if(compareResult >= 0) {
            return subtractAbsoluteValues(first.getSign(), first, second, precision, roundingMode);
        } else {
            return subtractAbsoluteValues(second.getSign(), second, first, precision, roundingMode);
        }
    },

    subtract: function(first, second, precision, roundingMode) {
        second = CalculationUtils.toBigNumber(second);
        if(first.getSign() !== second.getSign()) {
            return addAbsoluteValues(first.getSign(), first, second, precision, roundingMode);
        }
        var compareResult = Comparator.compareAbsoluteValues(first, second);
        if(compareResult >= 0) {
            return subtractAbsoluteValues(first.getSign(), first, second, precision, roundingMode);
        } else {
            return subtractAbsoluteValues(NumberUtils.invertSign(second.getSign()), second, first, precision, roundingMode);
        }
    },

    multiply: function(first, second, precision, roundingMode) {
        second = CalculationUtils.toBigNumber(second);
        var sign = (first.getSign() === second.getSign()) ? Constants.POSITIVE : Constants.NEGATIVE;
        return multiplyAbsoluteValues(sign, first, second, precision, roundingMode);
    },

    divide: function(first, second, precision, roundingMode) {
        second = CalculationUtils.toBigNumber(second);
        var sign = (first.getSign() === second.getSign()) ? Constants.POSITIVE : Constants.NEGATIVE;
        return divideAbsoluteValues(sign, first, second, precision, roundingMode);
    },

    abs: function(number) {
        return new BigNumber(Constants.POSITIVE, number.getValue(), number.getScale(), number.getPrecision(), number.getRoundingMode());
    },

    invert: function(number) {
        if(number.isZero()) {
            return number;
        }
        return new BigNumber(NumberUtils.invertSign(number.getSign()), number.getValue(), number.getScale(), number.getPrecision(), number.getRoundingMode());
    },

    toPrecision: function(number, precision, roundingMode) {
        return new BigNumber(number.getSign(), number.getValue(), number.getScale(), precision, roundingMode);
    },

    withRoundingMode: function(number, roundingMode) {
        return new BigNumber(number.getSign(), number.getValue(), number.getScale(), number.getPrecision(), roundingMode);
    },

    shift: function(number, shift, precision, roundingMode) {
        var newScale = number.getScale() - shift;
        return new BigNumber(number.getSign(), number.getValue(), newScale, precision, roundingMode);
    },

    integerValue: function(number) {
        var scale = number.getScale();
        if(scale === 0) {
            return number;
        }
        var value = number.getValue();
        var length = value.length;
        if(length <= scale) {
            return new BigNumber(number.getSign(), [0], 0, number.getPrecision(), number.getRoundingMode());
        }
        var integerPart = [];
        for(var i = scale; i < length; i++) {
            integerPart.push(value[i]);
        }
        return new BigNumber(number.getSign(), integerPart, 0, number.getPrecision(), number.getRoundingMode());
    },

    clone: function(number) {
        return new BigNumber(number.getSign(), number.getValue(), number.getScale(), number.getPrecision(), number.getRoundingMode());
    }
};

function addAbsoluteValues(sign, first, second, precision, roundingMode) {

    var maxScale = NumberUtils.maxScale(first, second);
    var resultLength = NumberUtils.commonLength(first, second);
    var maxPrecision = NumberUtils.maxPrecision(first, second);

    var result = [];
    var leftover = 0;
    var sum = 0;
    for(var i = 0; i < resultLength; i++) {
        var firstDigit = NumberUtils.getDigit(first, i + first.getScale() - maxScale);
        var secondDigit = NumberUtils.getDigit(second, i + second.getScale() - maxScale);
        sum = firstDigit + secondDigit + leftover;
        if(sum >= 10) {
            leftover = 1;
            sum = sum - 10;
        } else {
            leftover = 0;
        }
        result.push(sum);
    }
    if(leftover > 0) {
        result.push(leftover);
    }
    return new BigNumber(sign, result, maxScale, precision, roundingMode);
}

function subtractAbsoluteValues(sign, first, second, precision, roundingMode) {

    var maxScale = NumberUtils.maxScale(first, second);
    var resultLength = NumberUtils.commonLength(first, second);
    var maxPrecision = NumberUtils.maxPrecision(first, second);

    var result = [];
    var leftover = 0;
    for(var i = 0; i < resultLength; i++) {
        var firstDigit = NumberUtils.getDigit(first, i + first.getScale() - maxScale);
        var secondDigit = NumberUtils.getDigit(second, i + second.getScale() - maxScale);
        var sub = firstDigit - secondDigit - leftover;
        if(sub < 0) {
            leftover = 1;
            sub = sub + 10;
        } else {
            leftover = 0;
        }
        result.push(sub);
    }

    return new BigNumber(sign, result, maxScale, precision, roundingMode);
}

function multiplyAbsoluteValues(sign, first, second, precision, roundingMode) {
    var calculationPrecision = first.getScale() + second.getScale();
    if(calculationPrecision < precision) {
        calculationPrecision = precision;
    }
    var accumulator = new BigNumber(sign, [0], 0, calculationPrecision, roundingMode);
    var commonScale = first.getScale() + second.getScale();
    for(var i = 0; i < second.getValue().length; i++) {
        var secondDigit = NumberUtils.getDigit(second, i);
        var leftover = 0;
        var subValue = [];
        for(var j = 0; j < first.getValue().length; j++) {
            var firstDigit = NumberUtils.getDigit(first, j);
            var result = firstDigit * secondDigit + leftover;
            if(result >= 10) {
                var resultMod = result % 10;
                leftover = Math.floor((result - resultMod)/10);
                result = resultMod;
            } else {
                leftover = 0;
            }
            subValue.push(result);
        }
        if(leftover > 0) {
            subValue.push(leftover);
        }
        var iterationResult = new BigNumber(sign, subValue, commonScale - i, calculationPrecision, roundingMode);
        accumulator = accumulator.add(iterationResult);
    }
    return accumulator.toPrecision(precision, roundingMode);
}

function divideAbsoluteValues(sign, first, second, precision, roundingMode) {
    var leftover = first;
    var calculationPrecision = precision + 3;
    var accumulator = new BigNumber(Constants.POSITIVE, [0], 0, calculationPrecision, roundingMode);
    for(var i = 0; i < 500; i++) {
        var quotient = getIterationQuotient(leftover, second, calculationPrecision, roundingMode);
        var subtract = multiplyAbsoluteValues(Constants.POSITIVE, second, quotient, calculationPrecision, Constants.ROUNDING_MODE_DOWN);
        leftover = subtractAbsoluteValues(Constants.POSITIVE, leftover, subtract, calculationPrecision, roundingMode);
        accumulator = addAbsoluteValues(sign, accumulator, quotient, calculationPrecision, roundingMode);
        if(leftover.isZero() || CalculationUtils.isRequiredPrecision(quotient, precision + 1)) {
            return accumulator.toPrecision(precision);
        }
    };
    return accumulator.toPrecision(precision);
}

function getIterationQuotient(first, second, requiredPrecision, roundingMode) {
    if(first.isZero()) {
        return new BigNumber(Constants.POSITIVE, [0], 0, requiredPrecision, roundingMode);
    }
    var firstLength = first.getValue().length;
    var firstDigit = NumberUtils.getDigit(first, firstLength - 1) * 100 + NumberUtils.getDigit(first, firstLength - 2) * 10 +
        NumberUtils.getDigit(first, firstLength - 3);
    var secondLength = second.getValue().length;
    var secondDigit = NumberUtils.getDigit(second, secondLength - 1) * 10 + NumberUtils.getDigit(second, secondLength - 2);
    if(secondLength > 2) {
        secondDigit = secondDigit + 1;
    }
    var value = Math.floor((100 * firstDigit) / (secondDigit));
    var scale = (firstLength - first.getScale() - 3) - (secondLength  - second.getScale() - 2) - 2;
    var result = CalculationUtils.toBigNumber(value, requiredPrecision, roundingMode);
    var shiftedResult = result.shift(scale, requiredPrecision, roundingMode);
    return shiftedResult;
}
