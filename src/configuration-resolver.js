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
        var mergedFormatting = {};
        if(primary.formatting && secondary.formatting) {
            mergedFormatting.minAfterDot = resolveProperty(primary.formatting, secondary.formatting, 'minAfterDot'),
            mergedFormatting.maxAfterDot = resolveProperty(primary.formatting, secondary.formatting, 'maxAfterDot')
        } else if(primary.formatting) {
            mergedFormatting = primary.formatting;
        } else if(secondary.formatting) {
            mergedFormatting = secondary.formatting;
        }
        var merged = {
            decimalSeparator: resolveProperty(primary, secondary, 'decimalSeparator'),
            thousandsSeparator: resolveProperty(primary, secondary, 'thousandsSeparator'),
            precision: resolveProperty(primary, secondary, 'precision'),
            roundingMode: resolveProperty(primary, secondary, 'roundingMode'),
            formatting: mergedFormatting
        };
        Validators.validatePrecision(merged.precision);
        Validators.validateRoundingMode(merged.roundingMode);
        Validators.validateDecimalSeparator(merged.decimalSeparator);
        Validators.validateThousandsSeparator(merged.decimalSeparator);
        if(merged.decimalSeparator == merged.thousandsSeparator) {
            throw 'Decimal and thousands separators should have different values';
        }
        Validators.validateConfigurationFormatting(mergedFormatting);
        return merged;
    }
}

function resolveProperty(first, second, propertyName) {
    return second.hasOwnProperty(propertyName) ? second[propertyName] : first[propertyName];
}

function resolveSeparatorsFromString(input) {
    return {
        decimalSeparator: input.length == 7 ? input.charAt(5) : input.charAt(4),
        thousandsSeparator: input.length == 7 ? input.charAt(1) : undefined,
        precision: Constants.DEFAULT_PRECISION,
        roundingMode: Constants.DEFAULT_ROUNDING_MODE,
        formatting: {
            minAfterDot: undefined,
            maxAfterDot: undefined
        }
    };
}
