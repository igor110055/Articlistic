const mongo = require('../db/mongo/index');
const DatabaseError = require('../errors/DatabaseError');
const MissingParamError = require('../errors/MissingParamError');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const logger = require('../utils/logger');

module.exports = function (checkArticleId, checkWriterUsername, checkArticleOwnerShip, checkPublication, checkPublicationOwnership) {

    return async function asyncMiddleware(req, res, next) {
        let {
            articleId,
            writer,
            publicationId
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

            if (checkArticleOwnerShip) {

                if (article.username != req.username) {
                    return next(new NotAuthenticatedError('Article ownership is not authorized', 'middleware-article-ownership'));
                }

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

        if (checkPublication) {

            try {
                var publication = await mongo.publications.getPublication(publicationId);
            } catch (e) {
                return next(new DatabaseError('middleware-rejection-pub-db', e));
            }

            if (!publication) {
                return next(new NotAuthenticatedError('No publication with Id exists', 'middleware-publication'));
            }

            if (checkPublicationOwnership) {

                if (publication.username != req.username) {
                    return next(new NotAuthenticatedError('Publication ownership is not authorized', 'middleware-publication-ownership'));

                }
            }

            req.publicationId = publicationId;

        }

        next();

    }
}