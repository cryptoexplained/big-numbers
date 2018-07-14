'use strict';

var Constants = require('./src/constants');
var ConfigurationResolver = require('./src/configuration-resolver');
var BigNumber = require('./src/big-number');
var Parser = require('./src/parser');
var Formatter = require('./src/formatter');

module.exports = function(config) {

    var self = this;

    var _config = ConfigurationResolver.getLocale(config);
    var _parser = new Parser(_config);

    this.getConfiguration = function() {
        return _config;
    };

    this.of = function(input, config) {
        return _parser.parse(input, config);
    };

    this.formatter = function(config) {
        return new Formatter();
    };

    this.newBigNumber = function(sign, value, scale, precision, roundingMode) {
        return new BigNumber(sign, value, scale, precision, roundingMode);
    };
};
