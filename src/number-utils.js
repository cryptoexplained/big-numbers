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
        for(var i = 0; i < (scale - precision); i++) {
            var digit = this.safeGetDigit(value, i);
            digit = digit + leftover;
            if(roundingMode === Constants.ROUNDING_MODE_UP) {
                if(digit > 0) {
                    leftover = 1;
                } else {
                    leftover = 0;
                }
            } else if(roundingMode === Constants.ROUNDING_MODE_HALF_UP) {
                if(digit >= 5) {
                    leftover = 1;
                } else {
                    leftover = 0;
                }
            } else if(roundingMode === Constants.ROUNDING_MODE_HALF_DOWN) {
                if(digit > 5) {
                    leftover = 1;
                } else {
                    leftover = 0;
                }
            } else if(roundingMode === Constants.ROUNDING_MODE_CEIL) {
                if(digit > 0) {
                    leftover = 1;
                } else {
                    leftover = 0;
                }
            } else if(roundingMode === Constants.ROUNDING_MODE_FLOOR) {
                if(digit > 0) {
                    leftover = 1;
                } else {
                    leftover = 0;
                }
            } else if(roundingMode === Constants.ROUNDING_MODE_HALF_EVEN) {
                var nextDigit = this.safeGetDigit(value, i + 1);
                if(nextDigit % 2 === 0) {
                    if(digit >= 5) {
                        leftover = 1;
                    } else {
                        leftover = 0;
                    }
                } else {
                    if(digit > 5) {
                        leftover = 1;
                    } else {
                        leftover = 0;
                    }
                }
            }
        }
        return leftover;
    }
}
