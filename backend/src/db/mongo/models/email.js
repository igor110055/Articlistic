var config = require('../../../../config');
const {
    MDB_COLLECTION_EMAIL
} = require('../../../../constants');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_EMAIL;


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
        logger.debug(e);
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
        logger.debug(e);
        throw e;
    }
}


async function getEmailDoc(email) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            email: email
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Get email doc - email - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        logger.debug(e);
        throw e;
    }

}


async function createWalletOTP(email, otp, type) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.insertOne({
            created_at: new Date(),
            email,
            otp,
            type
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Create wallet otp - email - mongo response " + `Type: ${type}` + "  time: " + timeTaken.toString());

        return res;


    } catch (e) {
        logger.debug(e);
        throw e;
    }

}


async function checkWalletOTP(email, otp, type) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            email,
            otp,
            type
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Check wallet otp - email - mongo response - " + `Type: ${type}` + "  time: " + timeTaken.toString());

        return res;


    } catch (e) {
        logger.debug(e);
        throw e;
    }

}


async function checkOTP(email, otp) {
    let client;

    try {

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
        logger.debug(e);
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
        logger.debug(e);
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
        logger.debug(e);
        throw e;
    }
}


async function deleteAllWalletOTPsWithEmail(email, type) {
    let client;
    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.deleteMany({
            email: email,
            type
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("deleteOTP - email - mongo response time: " + timeTaken.toString());



        return res;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}


module.exports = {
    createOTP,
    checkOTP,
    deleteOTP,
    createTTLIndex,
    deleteAllOTPsWithEmail,
    deleteAllWalletOTPsWithEmail,
    getEmailDoc,
    createWalletOTP,
    checkWalletOTP
}