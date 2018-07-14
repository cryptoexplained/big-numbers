'use strict';

var Constants = require('./constants');

var TEST_NUMBER = 1234.5;

module.exports = {

    getLocale: function() {
        return resolveSeparatorsFromString(TEST_NUMBER.toLocaleString());
    },

    getSystem: function() {
        return resolveSeparatorsFromString(TEST_NUMBER.toString());
    },

    resolve: function(primary, secondary) {
        if(!secondary) {
            return primary;
        } else if(!primary) {
            return secondary;
        }
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
