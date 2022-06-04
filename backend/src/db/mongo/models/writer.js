var config = require('../../../../config');
const {
    MDB_COLLECTION_WRITERS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')


const dbName = config.mongo.db;
const collection = MDB_COLLECTION_WRITERS;

const MDB = require('../client').MDB;


async function getWriters() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        const allWriters = [];

        await db.aggregate([{
            $limit: 15
        }, {
            $lookup: {
                from: "users",
                localField: "username",
                foreignField: "username",
                as: "details",
                "pipeline": [{
                    "$project": {
                        _id: 0,
                        email: 0,
                        phone: 0,
                        refreshToken: 0,
                        wallet: 0,
                        public: 0,
                        private: 0
                    }
                }]
            }
        }


        ]).forEach((x) => {
            allWriters.push(x);
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getWriters mongo response time: " + timeTaken.toString());


        return allWriters;


    } catch (e) {
        logger.debug(e);
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
        logger.debug(e);
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
        logger.debug(e);
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
        logger.debug(e);
        throw e;
    }
}



module.exports = {
    getWriters,
    getWriterByName,
    createUniquenessIndex,
    getWriterProfile
}