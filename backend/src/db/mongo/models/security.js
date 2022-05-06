var config = require('../../../../config');
const {
    MDB_COLLECTION_SECURITY
} = require('../../../../constants');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_SECURITY;
const mongodbUri = config.mongo.uri;

const createUserType = 'create-user'
const forgotPasswordTypeMobile = 'fp-phone'
const forgotPasswordTypeEmail = 'fp-email'


/*
Read the comments carefully before proceeding. 
For security reasons: We have added a time to live index of 10 minutes. 

*/


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

        logger.info("createTTLIndex - security - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }

}

/*

First, the createUserAddPhone function makes a doc in collection which is type create-user
This must be used by the function after it to verify and set an email - which is done in the second function. 
After this,the third function, verify create User with both email and phone and delete. 

*/


async function createUserAddPhone(phone) {

    let client;


    if (!phone) throw "phone sent was undefined"

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.insertOne({
            type: createUserType,
            phone: phone,
            created_at: new Date()
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUserAddPhone - security - mongo response time: " + timeTaken.toString());


        return res.insertedId;


    } catch (e) {
        throw e;
    }

}



async function createUserAddEmail(email) {

    let client;


    if (!email) throw "Email sent was undefined"

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.insertOne({
            email: email,
            type: createUserType,
            created_at: new Date()
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUserAddEmail - security - mongo response time: " + timeTaken.toString());


        return res.insertedId;


    } catch (e) {
        throw e;
    }

}


async function verifyCreateUser(id, email) {
    let client;

    id = ObjectId(id);

    if (!email) throw "Email was undefined"

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.deleteOne({
            _id: id,
            type: createUserType,
            email: email
        });

        if (!res.deletedCount) throw "Something went wrong - please try verifying email  again."

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("verifyCreateUser - security - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


/*

    Creates a document in security collection - either for phone/email.
    This document will be used by reset password API.
    Check the functions after the next 2 functions.

*/

async function forgotPasswordUsingEmail(email) {

    let client;


    if (!email) throw "Email sent was undefined"

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.insertOne({
            type: forgotPasswordTypeEmail,
            email: email,
            created_at: new Date()
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUserAddEmail - security - mongo response time: " + timeTaken.toString());


        return res.insertedId;


    } catch (e) {
        throw e;
    }

}


async function forgotPasswordUsingPhone(phone) {

    let client;

    if (!phone) throw "Phone sent was undefined"

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.insertOne({
            type: forgotPasswordTypeMobile,
            phone: phone,
            created_at: new Date()
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("forgotPasswordUsingPhone - security - mongo response time: " + timeTaken.toString());


        return res.insertedId;


    } catch (e) {
        throw e;
    }

}


async function verifyEmailCode(id, email) {
    let client;

    if (!email) throw "Email sent was undefined"
    id = ObjectId(id);


    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.deleteOne({
            _id: id,
            type: forgotPasswordTypeEmail,
            email: email,
        });


        if (!res.deletedCount) {
            throw "Could not verify the email - reset password."
        }

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("verifyEmailCode - security - mongo response time: " + timeTaken.toString());


        return res.deletedCount;


    } catch (e) {
        throw e;
    }

}


async function verifyPhoneCode(id, phone) {
    let client;

    if (!phone) throw "Phone sent was undefined"
    id = ObjectId(id);


    try {


        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let res = await db.deleteOne({
            _id: id,
            type: forgotPasswordTypeMobile,
            phone: phone
        });


        if (!res.deletedCount) {
            throw "Could not verify the phone - reset password."
        }

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("verifyPhoneCode - security - mongo response time: " + timeTaken.toString());


        return res.deletedCount;


    } catch (e) {
        throw e;
    }

}


module.exports = {
    createTTLIndex,
    createUserAddEmail,
    createUserAddPhone,
    forgotPasswordUsingPhone,
    forgotPasswordUsingEmail,
    verifyEmailCode,
    verifyPhoneCode,
    verifyCreateUser
}