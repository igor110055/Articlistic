const config = require('../../../../config');
const {
    MDB_COLLECTION_DOLLAR_VALUE
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_DOLLAR_VALUE
const MDB = require('../client').MDB;

async function insertDollarValue(dollarValue, date) {
    if (!dollarValue || !date) {
        throw new Error("Dollar value required");
    }

    const obj = {
        value: dollarValue,
        date: date,
        timestamp: Date.now()
    };

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.insertOne(obj);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("insertDollarValue mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

module.exports = {
    insertDollarValue
}