const mongo = require('../db/mongo/index');
const DatabaseError = require('../errors/DatabaseError');
const MissingParamError = require('../errors/MissingParamError');
const logger = require('../utils/logger');

module.exports = function (checkArticleId, checkWriterUsername) {

    return async function asyncMiddleware(req, res, next) {
        let {
            articleId,
            writer
        } = req.query;

        if (checkArticleId) {

            if (!articleId) {

                return next(new MissingParamError('Parameters missing - Article', 'middleware-rejection-article'));
            }

            try {
                var article = await mongo.articles.getArticleById(articleId);
            } catch (e) {
                return next(new DatabaseError('middleware-rejection-article', e));
            }

            if (!article) {

                return next(new MissingParamError('Article Id not found', 'middleware-rejection-article'));
            }
            req.articleId = articleId;
        }

        if (checkWriterUsername) {

            if (!writer) {

                return next(new MissingParamError('Parameters missing - Writer', 'middleware-rejection-writer'));
            }

            try {
                var writerInfo = await mongo.writers.getWriterByName(writer);

            } catch (e) {
                return next(new DatabaseError('middleware-rejection-writer', e));
            }

            if (!writerInfo) {

                return next(new MissingParamError('Writer not found', 'middleware-rejection-writer'));
            }
            req.writer = writer;
        }
        logger.debug("hi")

        next();

    }
}