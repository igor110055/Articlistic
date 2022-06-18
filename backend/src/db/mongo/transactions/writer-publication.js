var config = require('../../../../config');
const {
    MDB_COLLECTION_PUBLICATIONS,
    MDB_COLLECTION_WRITERS
} = require('../../../../constants');
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const wc = MDB_COLLECTION_WRITERS;
const pc = MDB_COLLECTION_PUBLICATIONS;
const {
    MDB
} = require('../client')

async function createPublication(publicationId, publicationName, publicationPic, username, publicationOneLiner) {

    let client;

    let publication = {
        publicationId,
        publicationName,
        username
    }

    if (publicationPic) {
        publication.publicationPic = publicationPic;
    }

    if (publicationOneLiner) {
        publication.publicationOneLiner = publicationOneLiner;
    }

    try {

        client = await MDB.getClient();

        let writersCollection = client.db(dbName).collection(wc);
        let publicationsCollection = client.db(dbName).collection(pc);

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
            var publicationInsert
            try {

                publicationInsert = await publicationsCollection.insertOne(publication, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("createPublication-1");
                throw e;
            }

            if (!publicationInsert.insertedId) {
                await session.abortTransaction();
                throw new Error("Transaction error");
            }
            var writersUpdate
            try {

                writersUpdate = await writersCollection.updateOne({
                    'username': username
                }, {
                    $push: {
                        publications: {
                            publicationId,
                            publicationName,
                            publicationPic,
                            publicationOneLiner
                        }
                    }
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("createPublication-2");
                throw e;
            }


            if (!writersUpdate.modifiedCount) {
                await session.abortTransaction();
                throw new Error("createPublication-3");
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createPublication mongo response time: " + timeTaken.toString());

        return res;

    } catch (e) {
        logger.debug(e);
        throw e;

    }
}



async function updatePublication(publicationId, publicationName, publicationPic, username, publicationOneLiner) {

    let client;


    let writerUpdate = {};
    let pubUpdate = {};

    if (publicationName) {
        writerUpdate['publications.$.publicationName'] = publicationName;
        pubUpdate.publicationName = publicationName;
    }

    if (publicationPic) {
        writerUpdate['publications.$.publicationPic'] = publicationPic;
        pubUpdate.publicationPic = publicationPic;
    }

    if (publicationOneLiner) {
        writerUpdate['publications.$.publicationOneLiner'] = publicationOneLiner;
        pubUpdate.publicationOneLiner = publicationOneLiner;
    }

    try {

        client = await MDB.getClient();

        let writersCollection = client.db(dbName).collection(wc);
        let publicationsCollection = client.db(dbName).collection(pc);

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

        logger.debug(pubUpdate);


        var res = await session.withTransaction(async () => {
            var publicationUpdate
            try {

                publicationUpdate = await publicationsCollection.updateOne({
                    publicationId
                }, {
                    $set: pubUpdate
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("updatePublication-1");
                throw e;
            }

            if (!publicationUpdate.modifiedCount) {
                await session.abortTransaction();
                throw new Error("Transaction error");
            }
            var writersUpdate
            try {

                writersUpdate = await writersCollection.updateOne({
                    'username': username,
                    'publications.publicationId': publicationId
                }, {
                    $set: writerUpdate
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("createPublication-2");
                throw e;
            }


            if (!writersUpdate.modifiedCount) {
                await session.abortTransaction();
                throw new Error("createPublication-3");
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createPublication mongo response time: " + timeTaken.toString());

        return res;

    } catch (e) {
        logger.debug(e);
        throw e;

    }
}


module.exports = {
    createPublication,
    updatePublication
}