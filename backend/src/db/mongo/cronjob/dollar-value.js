const config = require('../../../../config');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const collection = 'dollar-value';
const MDB = require('../client').MDB;

async function insertDollarValue(dollarValue) {
    if (!dollarValue) {
        throw "Dollar value required";
    }

    const obj = {
        value: dollarValue,
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
        throw e;
    }
}

module.exports = {
    insertDollarValue
}