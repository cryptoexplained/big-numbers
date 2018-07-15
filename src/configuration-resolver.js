'use strict';

var Constants = require('./constants');
var Validators = require('./validators');

var TEST_NUMBER = 1234.5;

module.exports = {

    getSystem: function() {
        return resolveSeparatorsFromString(TEST_NUMBER.toString());
    },

    resolve: function(primary, secondary) {
        if(!secondary) {
            return primary;
        }
        var merged = {
            decimalSeparator: secondary.decimalSeparator ? secondary.decimalSeparator : primary.decimalSeparator,
            thousandsSeparator: secondary.thousandsSeparator ? secondary.thousandsSeparator : primary.thousandsSeparator,
            precision: secondary.precision ? secondary.precision : primary.precision,
            roundingMode: secondary.roundingMode ? secondary.roundingMode : primary.roundingMode
        };
        Validators.validatePrecision(merged.precision);
        Validators.validateRoundingMode(merged.roundingMode);
        Validators.validateDecimalSeparator(merged.decimalSeparator);
        Validators.validateThousandsSeparator(merged.decimalSeparator);
        if(merged.decimalSeparator == merged.thousandsSeparator) {
            throw 'Decimal and thousands separators should have different values';
        }
        return merged;
    }
}

function resolveSeparatorsFromString(input) {
    return {
        decimalSeparator: input.length == 7 ? input.charAt(5) : input.charAt(4),
        thousandsSeparator: input.length == 7 ? input.charAt(1) : undefined,
        precision: Constants.DEFAULT_PRECISION,
        roundingMode: Constants.DEFAULT_ROUNDING_MODE
    };
}
