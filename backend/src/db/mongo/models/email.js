var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = 'email';
const mongodbUri = config.mongo.uri;
async function createTTLIndex() {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.createIndex({
            created_at: 1
        }, {
            expireAfterSeconds: 10 * 60
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createTTLIndex - email - mongo response time: " + timeTaken.toString());

        
        return res;


    } catch (e) {
        throw e;
    }

}

async function createOTP(email, otp) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            created_at: new Date(),
            email,
            otp
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("CreateOTP - email - mongo response time: " + timeTaken.toString());

        
        return res;


    } catch (e) {
        throw e;
    }
}
async function checkOTP(email, otp) {
    let client;

    try {
        logger.debug(email);
        logger.debug(otp);

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            email,
            otp
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("checkOTP - email - mongo response time: " + timeTaken.toString());

        
        return res;


    } catch (e) {
        throw e;
    }
}


async function deleteOTP(otp) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.deleteOne({
            otp: otp
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("deleteOTP - email - mongo response time: " + timeTaken.toString());

        

        return res;


    } catch (e) {
        throw e;
    }
}


async function deleteAllOTPsWithEmail(email) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.deleteMany({
            email: email
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("deleteOTP - email - mongo response time: " + timeTaken.toString());

        

        return res;


    } catch (e) {
        throw e;
    }
}

module.exports = {
    createOTP,
    checkOTP,
    deleteOTP,
    createTTLIndex,
    deleteAllOTPsWithEmail
}