var config = require('../../../config');
require('dotenv').config();

var log4js = require("log4js");

var logger = log4js.getLogger();

if (config.environment == "local") {
    logger.level = "debug"
} else {
    logger.level = "info";
}

module.exports = logger