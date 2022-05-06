var config = require('../../../../config');
const {
    MDB_COLLECTION_USERS,
    MDB_COLLECTION_WRITERS
} = require('../../../../constants');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const uc = MDB_COLLECTION_USERS;
const wc = MDB_COLLECTION_WRITERS;
const mongodbUri = config.mongo.uri;
const {
    MDB
} = require('../client')



async function onboardingUpdate(categories, following, username) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let writersCollection = client.db(dbName).collection(wc);

        let startTime = Date.now();

        const session = client.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {
                level: 'local'
            },
            writeConcern: {
                w: 'majority'
            }
        }


        var res = await session.withTransaction(async () => {

            try {
                var res1 = await userCollection.updateOne({
                    "username": username
                }, {
                    $set: {
                        "public.categories": categories,
                        "public.following": following
                    }
                }, {
                    session: session
                })
            } catch (e) {

                await session.abortTransaction();
                logger.error("Transaction error in onboarding update - 1");
                throw e;
            }

            if (!res1.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {

                var res2 = await writersCollection.updateMany({
                    username: {
                        $in: following
                    }
                }, {
                    $addToSet: {
                        "followers": username
                    }
                }, {
                    session: session
                });
            } catch (e) {

                await session.abortTransaction();
                logger.error("Transaction error in onboarding update - 2");
                throw e;
            }


            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }



        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("onboardingUpdate update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}




module.exports = {
    onboardingUpdate
}



/*

ARCHIVED: Followers was moved to another collection, please write all the queries above this. 
DATE: 24-01-2022 23:32



async function followWriter(writer, username) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let writersCollection = client.db(dbName).collection(wc);

        let startTime = Date.now();

        const session = client.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {
                level: 'local'
            },
            writeConcern: {
                w: 'majority'
            }
        }


        var res = await session.withTransaction(async () => {


            try {
                var res1 = await userCollection.updateOne({
                    "username": username
                }, {
                    $addToSet: {
                        'public.following': writer
                    }
                }, {
                    session: session
                });
            } catch (e) {
                await session.abortTransaction();
                logger.error("Transaction error in follow writer - 1");
                throw e;
            }


            if (!res1.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {
                var res2 = await writersCollection.updateOne({
                    username: writer
                }, {
                    $addToSet: {
                        "followers": username
                    }
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("Transaction error in follow writer - 2");
                throw e;
            }

            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("followWriter update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}



async function unfollowWriter(writer, username) {

    let client;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let writersCollection = client.db(dbName).collection(wc);

        let startTime = Date.now();

        const session = client.startSession();

        const transactionOptions = {
            readPreference: 'primary',
            readConcern: {
                level: 'local'
            },
            writeConcern: {
                w: 'majority'
            }
        }


        var res = await session.withTransaction(async () => {


            try {
                var res1 = await userCollection.updateOne({
                    "username": username
                }, {
                    $pull: {
                        'public.following': writer
                    }
                }, {
                    session: session
                });
            } catch (e) {
                await session.abortTransaction();
                logger.error("Transaction error in unfollowWriter  - 1");
                throw e;
            }


            if (!res1.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {
                var res2 = await writersCollection.updateOne({
                    username: writer
                }, {
                    $addToSet: {
                        "followers": username
                    }
                }, {
                    session: session
                });
            } catch (e) {
                await session.abortTransaction();
                logger.error("Transaction error in unfollowWriter - 2");
                throw e;
            }

            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw "Transaction error";
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("unfollowWriter update mongo response time: " + timeTaken.toString());



        return res;

    } catch (e) {

        throw e;

    }
}


*/