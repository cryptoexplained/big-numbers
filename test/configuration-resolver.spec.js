'use strict';

var expect = require('chai').expect;
var ConfigurationResolver = require('../src/configuration-resolver');

describe('Configuration Resolver Specification', function() {

    it('when not provided then should resolve client configuration', function() {
        var result = ConfigurationResolver.getSystem();
        expect(result.decimalSeparator).to.equal('.');
        expect(result.thousandsSeparator).to.equal(undefined);
    });

});

