const mongo = require('../db/mongo/cronjob/index');
const s3 = require('../utils/s3/index')
const Sentry = require('@sentry/node');
const DatabaseError = require('../errors/DatabaseError');
const logger = require('../utils/logger');
const {
    getDollarValue
} = require('../utils/api');
const ServiceError = require('../errors/ServiceError');

module.exports = async function insertDollarValue() {

    /**
     * Call API for getting current dollar value. 
     */

    logger.info("Insert dollar value cronjob is working");

    try {
        var dollarApiResponse = await getDollarValue.getDollarValue();
    } catch (e) {
        Sentry.captureException("Could not fetch dollar value");
    }

    /**
     * Insert the value into database. 
     */

    const dollarValue = Number.parseFloat(dollarApiResponse.dollarValue);
    const date = dollarApiResponse.date;

    try {
        await mongo.dollarValue.insertDollarValue(dollarValue, date);
    } catch (e) {
        Sentry.captureException("Database error in dollar value");
    }

    logger.info('Dollar value is updated to: ' + dollarValue);


}