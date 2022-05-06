const mongo = require('../db/mongo/cronjob/index');
const s3 = require('../utils/s3/index')
const Sentry = require('@sentry/node');
const DatabaseError = require('../errors/DatabaseError');
const logger = require('../utils/logger');
const {
    getDollarValue
} = require('../utils/api');
const ServiceError = require('../errors/ServiceError');

async function insertDollarValue() {
    let now = Date.now();

    /**
     * Call API for getting current dollar value. 
     */

    logger.info("Insert dollar value cronjob is working");

    try {
        var value = await getDollarValue.getDollarValue();
    } catch (e) {
        Sentry.captureException("Could not fetch dollar value");
    }

    /**
     * Insert the value into database. 
     */

    try {
        await mongo.dollarValue.insertDollarValue(value);
    } catch (e) {
        Sentry.captureException("Database error in dollar value");
    }

    logger.info('Dollar value is updated to: ' + value);


}