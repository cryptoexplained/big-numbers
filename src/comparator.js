'use strict';

var Constants = require('./constants');
var NumberUtils = require('./number-utils');

module.exports = {

    compare: function(first, second) {
        if(first.getSign() !== second.getSign()) {
            return first.getSign();
        }
        var absoluteCompareResult = this.compareAbsoluteValues(first, second);
        return first.getSign() === Constants.POSITIVE ? absoluteCompareResult : -absoluteCompareResult;
    },

    compareAbsoluteValues: function(first, second) {
        var maxScale = NumberUtils.maxScale(first, second);
        var resultLength = NumberUtils.commonLength(first, second);
        for(var i = resultLength - 1; i >= 0; i--) {
            var firstDigit = NumberUtils.getDigit(first, i + first.getScale() - maxScale);
            var secondDigit = NumberUtils.getDigit(second, i + second.getScale() - maxScale);
            if(firstDigit > secondDigit) {
                return Constants.POSITIVE;
            } else if(firstDigit < secondDigit) {
                return Constants.NEGATIVE;
            }
        }
        return 0;
    },

    isZero(number) {
        var value = number.getValue();
        for(var i = 0; i < value.length; i++) {
            if(value[i] !== 0) {
                return false;
            }
        }
        return true;
    }
};
