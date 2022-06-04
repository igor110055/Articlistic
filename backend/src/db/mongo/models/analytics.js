var config = require('../../../../config');
const {
    MDB_COLLECTION_ANALYTICS
} = require('../../../../constants');
const dbName = config.mongo.db;
const MDB = require('../client').MDB;

const logger = require('../../../utils/logger/index')

const collection = MDB_COLLECTION_ANALYTICS;



async function createUniquenessIndex() {
    try {

        var client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();



        await db.createIndex({
            'username': 1
        }, {
            unique: true
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("analytics: createUniquenessIndex - mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e)
        throw e;
    }
}




module.exports = {
    createUniquenessIndex
}