const app = require('./app');
var config = require('../../config');
const logger = require('../utils/logger/index')
const http = require('http');
const start = require('./start');
const {
    MDB
} = require('../db/mongo/client');
const {
    RDB
} = require('../db/redis/client');


let env = config.environment;
let port = config.hosting.port || 3000;
let host = config.hosting.host || '0.0.0.0';

const server = http.createServer(app);

// start(server);

server.listen(port, async () => {
    await MDB.getClient();
    await RDB.getClient();
    logger.info("Server is up and running at " + host + " and port: " + port + " at Environment: " + env);
});