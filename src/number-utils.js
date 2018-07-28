'use strict';

var Constants = require('./constants');

module.exports = {

    getDigit: function(number, shift) {
        return this.safeGetDigit(number.getValue(), shift);
    },

    safeGetDigit: function(value, shift) {
        return shift < 0 || shift >= value.length ? 0 : value[shift];
    },

    maxScale: function(first, second) {
        return first.getScale() > second.getScale() ? first.getScale() : second.getScale();
    },

    maxPrecision: function(first, second) {
        return first.getPrecision() > second.getPrecision() ? first.getPrecision() : second.getPrecision();
    },

    commonLength: function(first, second) {
        var maxScale = this.maxScale(first, second);
        var resultLength = first.getValue().length - first.getScale() > second.getValue().length - second.getScale() ?
            first.getValue().length - first.getScale() : second.getValue().length - second.getScale();
        resultLength += maxScale;
        return resultLength;
    },

    invertSign: function(sign) {
        return sign === Constants.POSITIVE ? Constants.NEGATIVE : Constants.POSITIVE;
    },

    getRoundingLeftOver: function(sign, value, scale, precision, roundingMode) {
        if(roundingMode === Constants.ROUNDING_MODE_DOWN) {
            return 0;
        }
        if(roundingMode === Constants.ROUNDING_MODE_CEIL && sign === Constants.NEGATIVE) {
            return 0;
        }
        if(roundingMode === Constants.ROUNDING_MODE_FLOOR && sign === Constants.POSITIVE) {
            return 0;
        }
        if(scale <= precision) {
            return value;
        }
        var leftover = 0;
        var cutOffDigits = [];
        for(var i = (scale - precision) - 1; i >= 0; i--) {
            cutOffDigits.push(this.safeGetDigit(value, i));
        }

        if(cutOffDigits.length <= 0) {
            return 0;
        }

        if(roundingMode === Constants.ROUNDING_MODE_UP) {
            return increaseWhenNonZeros(cutOffDigits);
        } else if(roundingMode === Constants.ROUNDING_MODE_HALF_UP) {
            return halfUpRule(cutOffDigits);
        } else if(roundingMode === Constants.ROUNDING_MODE_HALF_DOWN) {
            return halfDownRule(cutOffDigits);
        } else if(roundingMode === Constants.ROUNDING_MODE_CEIL) {
            return increaseWhenNonZeros(cutOffDigits);
        } else if(roundingMode === Constants.ROUNDING_MODE_FLOOR) {
            return increaseWhenNonZeros(cutOffDigits);
        } else if(roundingMode === Constants.ROUNDING_MODE_HALF_EVEN) {
            var nexDigit = this.safeGetDigit(value, scale - precision);
            if(nextDigit % 2 === 0) {
                return halfUpRule(cutOffDigits);
            } else {
                return halfDownRule(cutOffDigits);
            }
        }
        return leftover;
    }
}

function increaseWhenNonZeros(cutOffDigits) {
    if(isAllZeros(cutOffDigits, 0)) {
        return 0;
    } else {
        return 1;
    }
}

function halfUpRule(cutOffDigits) {
    if(cutOffDigits[0] >= 5) {
        return 1;
    } else {
        return 0;
    }
}

function halfDownRule(cutOffDigits) {
    if(cutOffDigits[0] > 5) {
        return 1;
    } else if(cutOffDigits[0] <= 4) {
        return 0;
    } else {
        if(isAllZeros(cutOffDigits, 1)) {
            return 0;
        } else {
            return 1;
        }
    }
}

function isAllZeros(input, shift) {
    for(var i = shift; i < input.length; i++) {
        if(input[i] !== 0) {
            return false;
        }
    }
    return true;
}