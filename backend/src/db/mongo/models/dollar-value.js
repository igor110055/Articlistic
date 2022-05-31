const config = require('../../../../config');
const {
    MDB_COLLECTION_DOLLAR_VALUE
} = require('../../../../constants');
const logger = require('../../../utils/logger');

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_DOLLAR_VALUE;
const MDB = require('../client').MDB;

async function getDollarValue() {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();
        var res;

        await db.find({}).sort({
            $natural: -1
        }).limit(1).forEach((x) => {
            res = x;
        });

        logger.debug(res);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getDollarValue mongo response time: " + timeTaken.toString());

        return res.value;


    } catch (e) {
        throw e;
    }
}



module.exports = {
    getDollarValue
}