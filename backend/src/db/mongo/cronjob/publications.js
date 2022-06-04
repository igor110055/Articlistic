const config = require('../../../../config');
const {
    MDB_COLLECTION_PUBLICATIONS
} = require('../../../../constants');

const logger = require('../../../utils/logger');
const dbName = config.mongo.db;

const publicationCollections = MDB_COLLECTION_PUBLICATIONS;
const alertCollection = 'alert-cronjob'
const MDB = require('../client').MDB;



async function createDeletedAtIndex() {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(publicationCollections);

        let startTime = Date.now();


        await db.createIndex({
            'deleteAt': 1
        });

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("publication: createDeleteAt mongo response time: " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function getPublicationsToBeDeleted(deleteAtTime) {
    let client;

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(publicationCollections);

        let startTime = Date.now();

        const publicationToBeDeleted = [];

        await db.find({
            deleteAt: {
                $lt: deleteAtTime
            }
        }, {
            projection: {
                publicationId: 1,
                username: 1
            }
        }).forEach((x) => {
            publicationToBeDeleted.push(x);
        })

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("cronjob-mongo: get publication for  " + timeTaken.toString());


        return publicationToBeDeleted;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function delPubS3Error(publicationId) {
    let client;

    if (!publicationId) throw new Error("Publication Id is required parameter");

    const insertObj = {
        alertType: 'publication-delete-alert',
        publicationId,
    }

    try {

        client = await MDB.getClient();
        let db = client.db(dbName).collection(alertCollection);

        let startTime = Date.now();


        await db.insertOne(insertObj);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("cronjob-mongo: deletePubs3alert  " + timeTaken.toString());


        return;


    } catch (e) {
        logger.debug(e);
        throw e;
    }
}

async function deletePublication(publicationId, username) {
    let client;
    try {

        client = await MDB.getClient();

        let pub = client.db(dbName).collection(publicationCollections);
        let writers = client.db(dbName).collection('writers');

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
            var res1
            try {

                res1 = await pub.deleteOne({
                    publicationId: publicationId
                }, {
                    session: session
                })

            } catch (e) {

                await session.abortTransaction();
                logger.error("Transaction error in cronjob publication - 1");
                throw e;
            }

            if (!res1.deletedCount) {
                await session.abortTransaction();
                throw new Error("Transaction error - del pub");
            }
            var res2
            try {

                res2 = await writers.updateOne({
                    username: username
                }, {
                    $pull: {
                        publications: {
                            publicationId: publicationId
                        }
                    }
                })
            } catch (e) {

                await session.abortTransaction();
                logger.error("Transaction error in del pub - 2");
                throw e;
            }


            if (!res2.modifiedCount) {
                await session.abortTransaction();
                throw new Error("Transaction error - del pub - 2");
            }



        }, transactionOptions);


        let endTime = Date.now();

        let timeTaken = endTime - startTime;


        logger.info("cronjob-mongo: deletePublication  " + timeTaken.toString());

        return res;

    } catch (e) {
        logger.debug(e);
        throw e;
    }
}



module.exports = {
    createDeletedAtIndex,
    getPublicationsToBeDeleted,
    delPubS3Error,
    deletePublication
}