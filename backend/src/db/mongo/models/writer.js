var config = require('../../../../config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')


const dbName = config.mongo.db;
// const dbName = 'attentioun';
const collection = 'writers';
const mongodbUri = config.mongo.uri; // TODO: Add mongo db url here -> In config and .env file

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


async function getWriterProfile(username) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let writer = await db.findOne({
            'username': username
        }, {
            projection: {
                _id: 0,
                username: 0,
                articles: 0,
                categories: 0
            }
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



async function getInformationOfWriters(usernames) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let information = db.find({
            'username': {
                $in: usernames
            }
        })

        let res = [];

        await information.forEach((x) => {
            res.push(x);
        })

        //
        let endTime = Date.now();

        let timeTaken = endTime - startTime;
        logger.debug(res);
        logger.info("getInformationOfWriters mongo response time: " + timeTaken.toString());


        return res;


    } catch (e) {
        throw e;
    }
}



async function unfollowWriter(writer, user) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        // let writer = await db.updateOne({})

        //
        await db.updateOne({
            username: writer
        }, {
            $pull: {
                "followers": user
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("unfollowWriter mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        throw e;
    }
}



async function followWriter(writer, user) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();


        // let writer = await db.updateOne({})

        //
        await db.updateOne({
            username: writer
        }, {
            $addToSet: {
                "followers": user
            }
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("followWriter mongo response time: " + timeTaken.toString());


        return;

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

async function getFollowers(writer) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();



        let followers = (await db.findOne({
            username: writer
        })).followers;

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getFollowers mongo response time: " + timeTaken.toString());


        return followers ? followers : [];


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
    followWriter,
    unfollowWriter,
    insertWriter,
    getFollowers,
    removeWriterCategory,
    createUniquenessIndex,
    getWriterProfile
}