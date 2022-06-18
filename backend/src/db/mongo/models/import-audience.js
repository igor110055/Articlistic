var config = require("../../../../config");
const logger = require('../../../utils/logger/index')
const {
    MDB_COLLECTION_AUDIENCE
} = require('../../../../constants');

const MDB = require('../client').MDB;
const dbName = config.mongo.db;
const collection = MDB_COLLECTION_AUDIENCE;


async function insertTheData(data) {
    let client
    try {
        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);
        let startTime = Date.now();
        await db.insertMany(
            data
        )
        let endTime = Date.now();
        let timeTaken = endTime - startTime;
        logger.info("CSV inserted into mongo response time: " + timeTaken.toString());
    }
    catch (e) {
        logger.debug(e);
    }
}


module.exports = { insertTheData }