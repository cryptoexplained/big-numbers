'use strict';

var Constants = require('./constants');
var Comparator = require('./comparator');
var BigNumber = require('./big-number');
var ConfigurationResolver = require('./configuration-resolver');
var Parser = require('./parser');

var parser = new Parser(ConfigurationResolver.getSystem());

module.exports = {

    isRequiredPrecision: function(number, requiredPrecision) {
        var delta = new BigNumber(Constants.POSITIVE, [1], requiredPrecision, requiredPrecision + 1, Constants.ROUNDING_MODE_DOWN);
        return (Comparator.compareAbsoluteValues(number, delta) <= 0);
    },

    toBigNumber: function(number) {
        if((typeof number) === 'number') {
            var result = parser.parse(number);
            return result;
        } else if(number instanceof BigNumber) {
            return number;
        } else {
            throw 'Illegal argument of type [' + (typeof number) + ']. Only BigNumber or number types are supported';
        }
    }
};
