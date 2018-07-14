'use strict';

var Constants = require('./constants');
var NumberUtils = require('./number-utils');

module.exports = function(config) {

    var _config = config;

    this.format = function(number) {
        var valueLength = number.getValue().length;
        var scale = number.getScale();
        var formattingLength = valueLength > scale ? valueLength : scale;
        var formattedValue = number.getSign() === Constants.POSITIVE ? '' : Constants.MINUS;
        for(var i = formattingLength - 1; i >= 0; i--) {
            var digit = NumberUtils.getDigit(number, i);
            formattedValue = formattedValue + digit;
            if(i > 0 && scale === i) {
                formattedValue = formattedValue + _config.decimalSeparator;
            }
        }
        return formattedValue;
    };
}

