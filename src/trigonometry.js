'use strict';

var Constants = require('./constants');
var BigNumber = require('./big-number');

var PI = new BigNumber(Constants.POSITIVE, [5,9,7,2,3,8,3,3,4,6,2,6,4,8,3,2,3,9,7,9,8,5,3,5,6,2,9,5,1,4,1,3], 31, 31, Constants.ROUNDING_MODE_HALF_UP);

module.exports = {
    PI: PI
};
