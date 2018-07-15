'use strict';

var expect = require('chai').expect;
var ConfigurationResolver = require('../src/configuration-resolver');
var Constants = require('../src/constants');

describe('Configuration Resolver Specification', function() {

    it('when not provided then should resolve client configuration', function() {
        var result = ConfigurationResolver.getSystem();
        expect(result.decimalSeparator).to.equal('.');
        expect(result.thousandsSeparator).to.equal(undefined);
        expect(result.precision).to.equal(Constants.DEFAULT_PRECISION);
        expect(result.roundingMode).to.equal(Constants.DEFAULT_ROUNDING_MODE);
    });

});

