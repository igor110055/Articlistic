var config = require('../../../config');
require('dotenv').config();

console.log("In the config file: " + `${process.env.NODE_ENV}`);
console.log("In the config file: " + `${process.env.DEV_port}`);

var log4js = require("log4js");

var logger = log4js.getLogger();

if (config.environment == "local") {
    logger.level = "debug"
} else {
    logger.level = "info";
}

module.exports = logger