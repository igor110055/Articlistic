var config = require('../../../../config');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = 'blacklist';

async function checkToken(token) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            'token': token
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("checkToken mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function addToken(token, username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            'username': username,
            'token': token
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("addToken mongo response time: " + timeTaken.toString());



        return res;


    } catch (e) {
        throw e;
    }
}
module.exports = {
    checkToken,
    addToken
}