const mongo = require('../db/mongo/cronjob/article');
const s3 = require('../utils/s3/index')
const Sentry = require('@sentry/node');
const DatabaseError = require('../errors/DatabaseError');
const logger = require('../utils/logger/index')

module.exports = async function deleteArticles() {


    /**
     * MongoDB query to find all the articles which are older than Date.now()
     */
    let time = Date.now();

    /**
     * Throwing error here because it can cause a severe error.
     */
    try {


        var articles = await mongo.getArticlesMarkedForDeletion(time);

    } catch (e) {
        throw new DatabaseError('delete-articles-cronjob', e);
    }


    /**
     * Delete all the articles from mongoDB.
     * This is kept before deleting pictures because just in case something goes wrong - 
     * We could handle it manually and not show it to the user once he has deleted. 
     */

    const listOfArticleIds = [];

    articles.forEach(({
        articleId
    }) => {
        listOfArticleIds.push(articleId);
    });

    /**
     * Throwing error here because it doesn't cause any severe error.
     */
    try {

        await mongo.deleteArticles(listOfArticleIds);

    } catch (e) {
        throw new DatabaseError('delete-articles-cronjob', e);
    }

    /**
     * Not throwing errors over here. 
     * This can be severe and hence no throwing errors here. 
     */

    for (let x = 0; x < articles.length; x++) {

        /**
         * Delete all the images from S3  
         */

        const articleId = articles[x].articleId;
        const username = articles[x].username;

        logger.info(`Deleting article: ${articleId} for ${username}`)

        try {

            await s3.init().fullDeleteArticle(username, articleId)

        } catch (e) {

            try {

                await mongo.deleteS3FileFailAlert(articleId, username);

            } catch (e) {

                Sentry.captureException(e);

            }
        }
    }


}