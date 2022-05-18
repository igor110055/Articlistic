var config = require('../../../config');
const MongoClient = require('mongodb').MongoClient;
const logger = require('../../utils/logger/index')
const mongodbUri = config.mongo.uri;
class MDB {

    static async getClient() {
        if (this.client) {
            return this.client
        }
        logger.info("Cache miss - Connecting to MongoDB client now.")

        let startTime = Date.now();

        this.client = await MongoClient.connect(this.url);

        logger.info("Mongo Client time taken: " + (Date.now() - startTime).toString() + "ms");

        return this.client
    }

}

MDB.url = mongodbUri;

module.exports = {
    MDB
}