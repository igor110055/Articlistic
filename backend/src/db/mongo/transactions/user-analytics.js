var config = require('../../../../config');
const logger = require('../../../utils/logger/index')

const dbName = config.mongo.db;
const uc = 'users';
const ac = 'analytics';
const wc = 'writers';
const {
    MDB
} = require('../client')

async function createUser(user) {

    let client;
    let username = user.username;

    try {

        client = await MDB.getClient();

        let userCollection = client.db(dbName).collection(uc);
        let analyticsCollection = client.db(dbName).collection(ac);
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

                var userInsert = await userCollection.insertOne(user, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("error in create user - 1");
                throw e;
            }

            if (!userInsert.insertedId) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {

                var analyticsInsert = await analyticsCollection.insertOne({
                    'username': username,
                    'writers': [],
                    'articles': []
                }, {
                    session: session
                });

            } catch (e) {
                await session.abortTransaction();
                logger.error("error in create user - 1");
                throw e;
            }


            if (!analyticsInsert.insertedId) {
                await session.abortTransaction();
                throw "Transaction error";
            }

            try {
                var writerInsert = await writersCollection.insertOne({
                    'username': username,
                    'publications': [],
                    'categories': [],
                }, {
                    session: session
                })
            } catch (e) {
                await session.abortTransaction();
                logger.error("CreateUser: DB: New Writer");
                throw e;
            }

            if (!writerInsert.insertedId) {
                await session.abortTransaction();
                throw "createUser: DB: New Writer Not Inserted"
            }

        }, transactionOptions);

        let endTime = Date.now();

        let timeTaken = endTime - startTime;

        logger.info("createUser mongo response time: " + timeTaken.toString());

        return res;

    } catch (e) {
        throw e;
    }
}

module.exports = {
    createUser
}