const config = require('../../../../config');

const logger = require('../../../utils/logger');
const dbName = config.mongo.db;

const {
    MDB
} = require('../client');




async function unsetArticleFieldInCategories() {
    let client;
    try {

        client = await MDB.getClient();
        const startTime = Date.now();

        let db = client.db(dbName).collection('categories');
        await db.updateMany({}, {
            $unset: {
                articles: 1
            }
        }, {
            multi: true
        });

        logger.info(`Time taken for migration script: ${Date.now() - startTime}ms`);

    } catch (e) {
        logger.error(e);
    }
}


/**
 * For Alpha v0.2.0
 */

/*
if (Date.now()) {

    unsetArticleFieldInCategories();

}
*/