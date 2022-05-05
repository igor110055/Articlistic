const startSocketServer = require('../utils/socket/chat/server');
const {
    startDatabase
} = require('../db/mongo/client');

async function start(server) {
    // await startDatabase();
    // await startSocketServer(server);
}

module.exports = start;