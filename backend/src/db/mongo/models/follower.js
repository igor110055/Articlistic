var config = require('../../../../config');
const {
    MDB_COLLECTION_FOLLOWERS
} = require('../../../../constants');
const dbName = config.mongo.db;
const MDB = require('../client').MDB;

const logger = require('../../../utils/logger/index')

const collection = MDB_COLLECTION_FOLLOWERS;

async function createUniqueIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.createIndex({
            username: 1,
            follows: 1
        }, {
            unique: true
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUniqueIndex - follower mongo response time: " + timeTaken.toString());


    } catch (e) {
        logger.debug(e);
        throw e;
    }


}

async function followMultiple(followArray = []) {

    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);


        let startTime = Date.now();

        const res = await db.insertMany(followArray)
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("follow multiple mongo response time: " + timeTaken.toString());

        return res.insertedCount;

    } catch (e) {
        logger.debug(e);
        throw e;
    }

}

async function follow(username, follows, _isWriter) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.insertOne({
            username: username,
            follows: follows,
            timestamp: Date.now()
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("follow mongo response time: " + timeTaken.toString());


    } catch (e) {
        logger.debug(e);
        throw e;
    }


}



async function unfollow(username, follows) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        await db.deleteOne({
            username: username,
            follows: follows
        })
        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("unfollow mongo response time: " + timeTaken.toString());


    } catch (e) {
        logger.debug(e);
        throw e;
    }

}


async function getFollowedWriters(username, limit, skip) {
    let client;

    if (!limit) limit = 5;
    if (!skip) skip = 0;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let followed = [];

        /**
         * Aggregation: 
         * Get all the following of the user. 
         * Project the follows field to keep it light. 
         * Join from writers collection & store it in a field. 
         * Match that field's existence. (Get writers only)
         * Sort by latest followed writer. 
         */
        await db.aggregate([{
            '$match': {
                'username': username
            }
        }, {
            '$project': {
                'follows': 1
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'follows',
                'foreignField': 'username',
                'as': 'userDetails',
                'pipeline': [{
                    '$project': {
                        'isWriter': 1,
                        'name': 1,
                        'profilePic': 1
                    }
                }]
            }
        }, {
            '$match': {
                'userDetails.0.isWriter': true
            }
        }, {
            '$lookup': {
                'from': 'writers',
                'localField': 'follows',
                'foreignField': 'username',
                'as': 'writerDetails',
                'pipeline': [{
                    '$project': {
                        'publications': 1
                    }
                }]
            }
        }]).forEach((x) => {
            followed.push(x);
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getFollowedWriters mongo response time: " + timeTaken.toString());
        return followed;
    } catch (e) {
        logger.debug(e);
        throw e;
    }

}




async function getFollowing(username, limit, skip) {
    let client;

    if (!limit) limit = 10;
    if (!skip) skip = 0;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let following = [];

        await db.find({
            username: username
        }, {
            projection: {
                follows: 1,
            }
        }).sort({
            _id: -1
        }).limit(limit).skip(skip).forEach((x) => {
            following.push(x.follows);
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getFollowing mongo response time: " + timeTaken.toString());
        return following;

    } catch (e) {
        logger.debug(e);
        throw e;
    }

}



async function getFollowers(username, limit, skip) {
    let client;

    if (!limit) limit = 10;
    if (!skip) skip = 0;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(collection);

        let startTime = Date.now();

        let followers = [];

        await db.find({
            follows: username
        }).sort({
            _id: -1
        }).limit(limit).skip(skip).forEach((x) => {
            followers.push(x.username);
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("getFollowers mongo response time: " + timeTaken.toString());
        return followers;

    } catch (e) {
        logger.debug(e);
        throw e;
    }

}



module.exports = {
    follow,
    unfollow,
    getFollowedWriters,
    createUniqueIndex,
    getFollowing,
    getFollowers,
    followMultiple
}