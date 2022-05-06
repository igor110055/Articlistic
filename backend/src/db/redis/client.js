const Sentry = require('@sentry/node');
var config = require('../../../config');
const logger = require('../../utils/logger/index')
var {
    createClient
} = require('redis');

class RDB {

    static async getClient() {
        if (this.client) {
            return this.client
        }
        logger.info("Cache miss - Connecting to Redis client now.")

        let startTime = Date.now();

        this.client = createClient({
            url: config.redis.uri
        });

        this.client.on('error', (err) => {
            Sentry.captureException(err.toString());
        });

        await this.client.connect();

        logger.info("Started Redis client now: " + (Date.now() - startTime).toString() + "ms");

        return this.client;
    }

    static async setClient(client) {
        this.client = client;
        logger.info("Connected to redis...");
        return this.client;
    }

}


module.exports = {
    RDB
}