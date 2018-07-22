'use strict';

var Constants = require('./constants');
var ConfigurationResolver = require('./configuration-resolver');
var NumberUtils = require('./number-utils');

module.exports = function(config) {

    var _config = config;

    this.format = function(number, config) {
        var configToUse = ConfigurationResolver.resolve(_config, config);
        var valueLength = number.getValue().length;
        var scale = number.getScale();
        var minAfterDot = undefined;
        if(configToUse.formatting && configToUse.formatting.minAfterDot) {
            minAfterDot = config.formatting.minAfterDot;
        }
        var maxAfterDot = undefined;
        if(configToUse.formatting && configToUse.formatting.maxAfterDot) {
            maxAfterDot = config.formatting.maxAfterDot;
        }
        var formattingLength = valueLength > scale ? valueLength : scale + 1;
        var digitsShift = 0;
        if(minAfterDot && scale < minAfterDot) {
            digitsShift = digitsShift + (scale - minAfterDot);
        }
        if(maxAfterDot && scale > maxAfterDot) {
            digitsShift = digitsShift + (scale - maxAfterDot);
        }
        var formattedValue = number.getSign() === Constants.POSITIVE ? '' : Constants.MINUS;
        var trailingZeros = 0;
        var digitsAfterDot = 0;
        for(var i = formattingLength - 1; i >= digitsShift; i--) {
            var digit = NumberUtils.getDigit(number, i);
            formattedValue = formattedValue + digit;
            if(i < scale) {
                digitsAfterDot++;
                if(digit === 0) {
                    trailingZeros++;
                } else {
                    trailingZeros = 0;
                }
            }
            if(i > digitsShift && i === scale) {
                formattedValue = formattedValue + configToUse.decimalSeparator;
            }
            if(configToUse.thousandsSeparator && i > digitsShift && i > scale && ((i - scale) % 3) === 0) {
                formattedValue = formattedValue + configToUse.thousandsSeparator;
            }
        }
        var cutoff = minAfterDot ? 0 : trailingZeros;
        if(minAfterDot && trailingZeros > 0 && (digitsAfterDot - trailingZeros) < minAfterDot) {
            cutoff = digitsAfterDot - minAfterDot;
        }
        if(cutoff > 0) {
            if(formattedValue.charAt(formattedValue.length - cutoff - 1) === configToUse.decimalSeparator) {
                cutoff++;
            }
            formattedValue = formattedValue.substring(0, formattedValue.length - cutoff);
        }
        return formattedValue;
    };
}
