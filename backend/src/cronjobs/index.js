const cron = require('node-cron');
const convertISTtoCronUTC = require('../utils/functions/convertISTtoCronUTC');
const logger = require('../utils/logger/index');
const deleteArticles = require('./deleteArticles');
const deletePublications = require('./deletePublications');
const insertDollarValue = require('./insertDollarValue');

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


        /**
         * This runs everyday at 8:15pm UTC
         * US markets close every day at 8:00pm UTC
         */

        cron.schedule("15 20 * * *", () => {

            insertDollarValue();

        })

    } catch (e) {
        logger.error(e);
    }
}

scheduler();