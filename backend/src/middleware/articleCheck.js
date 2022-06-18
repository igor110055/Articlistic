const mongo = require('../db/mongo/index');
const DatabaseError = require('../errors/DatabaseError');
const MissingParamError = require('../errors/MissingParamError');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const logger = require('../utils/logger');

module.exports = function (setArticle) {
    return async function asyncMiddleware(req, res, next) {
        const articleId = req.query.articleId;

        if (!articleId) {

            return next(new MissingParamError('Parameters missing - Article', 'middleware-rejection-article'));
        }
        var article
        try {
            article = await mongo.articles.getArticleById(articleId);
        } catch (e) {
            return next(new DatabaseError('middleware-rejection-article', e));
        }

        if (!article) {

            return next(new MissingParamError('Article Id not found', 'middleware-rejection-article'));
        }

        if (setArticle) {
            req.article = article;

        } else {

            req.articleId = articleId;

        }
        next();



    }
}