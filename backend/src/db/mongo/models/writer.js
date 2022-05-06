var config = require('../../../../config');
const {
    MDB_COLLECTION_WRITERS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')


const dbName = config.mongo.db;
const collection = MDB_COLLECTION_WRITERS;

const MDB = require('../client').MDB;


async function getWriters(skip, limit) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let allWriters = [];


        let cursor = db.find({}, {
            projection: {
                _id: 0,
                categories: 0
            }
        }).limit(limit).skip(skip);

        await cursor.forEach((x) => {
            allWriters.push(x)
        });

        let count = await db.countDocuments();

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getWriters mongo response time: " + timeTaken.toString());


        return {
            count: count,
            writers: allWriters
        };


    } catch (e) {
        throw e;
    }
}

async function getWriterByName(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let writer = await db.findOne({
            'username': username
        })

        //
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getWriterByName mongo response time: " + timeTaken.toString());


        return writer;


    } catch (e) {
        throw e;
    }
}



async function getWriterProfile(username, my) {
    let client;

    const projection = my ? {
        _id: 0,
        username: 0,
        articles: 0,
        categories: 0
    } : {
        _id: 0,
        username: 0,
        articles: 0,
        categories: 0,
        earnings: 0
    };

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let writer = await db.findOne({
            'username': username
        }, {
            projection: projection
        })

        //
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getWriterProfile mongo response time: " + timeTaken.toString());


        return writer;


    } catch (e) {
        throw e;
    }
}

/*
async function removeWriterCategory(username, category) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let writer = await db.updateOne({
            'username': username
        }, {
            $pull: {
                categories: category
            }
        })

        //
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getWriterByName mongo response time: " + timeTaken.toString());


        return writer;


    } catch (e) {
        throw e;
    }
}



async function insertWriter(username, description, categories, image, profileName) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();



        await db.insertOne({
            username: username,
            description: description,
            categories: categories ? categories : [],
            image: image,
            name: profileName
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("followWriter mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        throw e;
    }
}

*/


async function createUniquenessIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        await db.createIndex({
            'username': 1
        }, {
            unique: true
        });


        let endTime = Date.now();
        let timeTaken = endTime - startTime;

        logger.info("categories: createUniquenessIndex mongo response time: " + timeTaken.toString());




    } catch (e) {
        throw e;
    }
}



module.exports = {
    getWriters,
    getWriterByName,
    createUniquenessIndex,
    getWriterProfile
}