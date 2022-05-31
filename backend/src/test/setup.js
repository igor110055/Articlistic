const {
    MongoMemoryServer,
    MongoMemoryReplSet
} = require("mongodb-memory-server");

const MockRedis = require('redis-mock');
const redis = require('../db/redis/client')
const mongo = require('../db/mongo/client');
const logger = require("../utils/logger");

var MongoReplicaSet;
/**
 * It starts a MongoDB replica set with 4 nodes, and then starts a MongoDB client.
 */

beforeAll(async () => {
    jest.resetModules();
    MongoReplicaSet = await MongoMemoryReplSet.create({});
    const mongoUri = MongoReplicaSet.getUri();
    mongo.MDB.url = mongoUri;
    await mongo.MDB.getClient();

    /*
     *Connecting to redis using SetRedis function.
     */
    const rClient = MockRedis.createClient();
    await redis.RDB.setClient(rClient);

})

beforeEach(async () => {
    const collections = await (await mongo.MDB.getClient()).db().collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    (await (await mongo.MDB.getClient()).close());
})