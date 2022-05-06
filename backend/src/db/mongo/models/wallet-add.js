var config = require('../../../../config');
const {
    MDB_COLLECTION_WALLET_ADD
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_WALLET_ADD;


async function createOrder(username, amount, orderId, credits, currency) {



    if (!amount || !orderId || !username || !credits) {
        throw "Some required parameters missing for creating order"
    }
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        const dbObj = {
            orderId,
            status: 'created',
            amount,
            username,
            credits,
            currency,
        }

        let response = await db.insertOne(dbObj);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("create order - wallet-add - mongo response time: " + timeTaken.toString());

        return response;

    } catch (e) {
        throw e;
    }
}

module.exports = {
    createOrder
}