const mongo = require('../db/mongo/cronjob/index');
const s3 = require('../utils/s3/index')
const Sentry = require('@sentry/node');
const DatabaseError = require('../errors/DatabaseError');
const logger = require('../utils/logger');

module.exports = async function deletePublications() {
    /**
     * Get all the publications that are supposed to be deleted.
     */
    let time = Date.now();

    logger.info('Deleting publications - triggered.');
    var publicationsToBeDeleted
    try {

        publicationsToBeDeleted = await mongo.publications.getPublicationsToBeDeleted(time);

    } catch (e) {

        throw new DatabaseError('cronjob-pub-fetchPublicationsToBeDeleted', e);

    }


    while (publicationsToBeDeleted.length) {

        /**
         * Iterate over each publication's articles and follow these steps:
         * 1. Get Article List & Delete Articles From MongoDB
         * 2. Delete each Article's images from S3. - In case error occurs store in alert collection. 
         * 3. Delete each Article JSON file from S3. - In case error occurs store in alert collection.
         */

        const pub = publicationsToBeDeleted.pop();

        const publicationId = pub.publicationId;
        const pubUsername = pub.username;

        logger.info(`Delete publication for ${pubUsername}  with publicationId: ${publicationId} `);
        var articles
        try {

            articles = await mongo.articles.getArticlesForPublication(publicationId);

        } catch (e) {
            Sentry.captureException(e);
            continue;
        }

        const listOfArticleIds = [];

        articles.forEach(({
            articleId
        }) => listOfArticleIds.push(articleId));

        try {

            await mongo.articles.deleteArticles(listOfArticleIds);

        } catch (e) {
            Sentry.captureException(e);
            continue;

        }


        while (articles.length) {

            /**
             * Delete all the images from S3  
             */
            const currArticle = articles.pop();

            const articleId = currArticle.articleId;
            const username = currArticle.username;

            try {

                await s3.init().fullDeleteArticle(username, articleId);

            } catch (e) {

                try {

                    await mongo.articles.deleteS3FileFailAlert(articleId, username);

                } catch (e) {

                    Sentry.captureException(e);

                }
            }


        }

        /* 
         * 1. Delete publication from MongoDB. 
         * 2. Delete publication from s3. In case it fails store in alerts collection. 
         */

        try {

            await mongo.publications.deletePublication(publicationId, pubUsername);

        } catch (e) {
            Sentry.captureException(e);

        }

        try {

            await s3.init().fullDeletePublication(pubUsername, publicationId);

        } catch (e) {

            try {

                await mongo.publications.delPubS3Error(publicationId);

            } catch (err) {

                Sentry.captureException(err);

            }
        }

    }



}