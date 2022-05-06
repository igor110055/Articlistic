const cron = require('node-cron');
const convertISTtoCronUTC = require('../utils/functions/convertISTtoCronUTC');
const logger = require('../utils/logger/index');
const deleteArticles = require('./deleteArticles');
const deletePublications = require('./deletePublications');

function scheduler() {

    try {
        /**
         * Run delete articles cronjob every 41 minutes. 
         */
        cron.schedule("*/41 * * * *", () => {

            logger.info('Scheduler running now for articles.');

            deleteArticles();
        })


        /**
         * Run delete publications cronjob every hour. 
         */

        cron.schedule("0 * * * *", () => {

            logger.info('Scheduler running now for publications');

            deletePublications();

        })

    } catch (e) {
        logger.error(e);
    }
}

scheduler();