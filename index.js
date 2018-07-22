'use strict';

var Constants = require('./src/constants');
var ConfigurationResolver = require('./src/configuration-resolver');
var BigNumber = require('./src/big-number');
var Parser = require('./src/parser');
var Formatter = require('./src/formatter');
var Functions = require('./src/functions');
var Trigonometry = require('./src/trigonometry');

module.exports = function(config) {

    var _config = ConfigurationResolver.resolve(ConfigurationResolver.getSystem(), config);

    var _parser = new Parser(_config);
    var _formatter = new Formatter(_config);

    this.getConfiguration = function() {
        return _config;
    };

    this.of = function(input, config) {
        return _parser.parse(input, ConfigurationResolver.resolve(_config, config));
    };

    this.format = function(input, config) {
        return _formatter.format(input, ConfigurationResolver.resolve(_config, config));
    }
};

module.exports.E = Functions.E;
module.exports.PI = Trigonometry.PI;

module.exports.RoundingMode = {
    UP: Constants.ROUNDING_MODE_UP,
    DOWN: Constants.ROUNDING_MODE_DOWN,
    CEIL: Constants.ROUNDING_MODE_CEIL,
    FLOOR: Constants.ROUNDING_MODE_FLOOR,
    HALF_UP: Constants.ROUNDING_MODE_HALF_UP,
    HALF_DOWN: Constants.ROUNDING_MODE_HALF_DOWN,
    HALF_EVEN: Constants.ROUNDING_MODE_HALF_EVEN
};
