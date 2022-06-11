const { parseArray } = require('../utils/parameterStore/paramStore');

var environVarArray = ['SENTRY_URI', 'ATT_AWS_ACCESS_ID', 'ATT_AWS_REGION', 'ATT_AWS_S3_BUCKET_ARTICLES',
    'ATT_AWS_S3_BUCKET_PROFILE', 'ATT_AWS_SECRET_KEY', 'DEV_MONGO_DB_NAME',
    'DEV_MONGO_DB_URI', 'DEV_SALT_ENC', 'DEV_host', 'DEV_port', 'EXCHANGE_API_RATE_ACCESS_CODE',
    'GOOGLE_CLIENT_ID', 'IP_API_KEY', 'REACT_APP_ENCRYPTION_SALT',
    'REACT_APP_SERVER_LINK', 'REDIS_URI', 'RP_KEY_ID', 'RP_SECRET_KEY',
    'SENDGRID_KEY', 'TF_API_KEY', 'TOKEN_SECRET', 'URL_FOR_ARTICLES', 'URL_FOR_PROFILE', 'URL_FOR_AUDIENCE_FILE']

async function x() {


    await parseArray(environVarArray);
    var config = require('../../config');
    const app = require('./app');
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


        MDB.getClient();
        RDB.getClient();
        logger.info("Server is up and running at " + host + " and port: " + port + " at Environment: " + env);

    });
}

x(); 
