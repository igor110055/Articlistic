var config = require('../../../../config');
const {
    MDB_COLLECTION_PUBLICATIONS
} = require('../../../../constants');

const logger = require('../../../utils/logger/index')
const MDB = require('../client').MDB;

const dbName = config.mongo.db;
const collection = MDB_COLLECTION_PUBLICATIONS;
const mongodbUri = config.mongo.uri;


async function getPublication(publicationId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            publicationId
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Get Publication - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}



async function getAllPublicationsForWriter(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();
        let publications = [];


        await db.find({
            username: username
        }, {
            projection: {
                _id: 0,
                username: 0
            }
        }).forEach((x) => {
            publications.push(x);
        });;


        // await res.

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Get All Publication for Writers- mongo response time: " + timeTaken.toString());


        return publications;


    } catch (e) {
        throw e;
    }
}



async function markForDelete(publicationId, deleteAt) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            publicationId: publicationId
        }, {
            $set: {
                deleteAt: deleteAt
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Delete Publication - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function getPublicationForCheck(publicationId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            publicationId
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Get Publication - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function createUniquenessIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.createIndex({
            publicationId: 1
        }, {
            unique: true
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Publication: createUniquenessIndex - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

async function createUniquenessIndex2() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.createIndex({
            username: 1,
            publicationName: 1
        }, {
            unique: true
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Publication: createUniquenessIndex2 - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}


async function getPublicationArticle(publicationId) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.findOne({
            publicationId
        }, {
            projection: {
                publicationArticle: 1
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getPublicationArticle- mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}



async function updateArticleInPublication(publicationId, writeupLink, intro) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        let res = await db.updateOne({
            publicationId
        }, {
            $set: {
                intro: intro,
                publicationArticle: writeupLink
            }
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("Get Publication - mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}

module.exports = {
    getPublication,
    updateArticleInPublication,
    getPublicationForCheck,
    getPublicationArticle,
    createUniquenessIndex,
    createUniquenessIndex2,
    getAllPublicationsForWriter,
    markForDelete
}