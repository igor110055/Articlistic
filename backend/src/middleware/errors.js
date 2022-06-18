const NetworkError = require('../errors/NetworkError');
const logger = require('../utils/logger');
const DatabaseError = require('../errors/DatabaseError');
const NotAuthenticatedError = require('../errors/NotAuthenticatedError');
const MissingParamError = require('../errors/MissingParamError');
const NotFoundError = require('../errors/NotFoundError')
const ServiceError = require('../errors/ServiceError');
const BadRequestError = require('../errors/BadRequestError')

const Sentry = require('@sentry/node');

module.exports = function () {
    return function (err, _req, res, _next) {
        if (err instanceof NetworkError || err instanceof DatabaseError || err instanceof NotAuthenticatedError || err instanceof MissingParamError || err instanceof NotFoundError || err instanceof ServiceError || err instanceof BadRequestError) {
            let route = err.route ? err.route : 'Unknown route.';
            let error = err.error ? err.error.toString() : 'No specific info related to error.';
            let statusCode = err.statusCode ? err.statusCode : 400;
            let message = err.message ? err.message : 'Some error occurred.';
            let name = err.name ? err.name : 'SomeError'

            logger.error(`Some error occurred at Route: ${route} with status code: ${statusCode} - message: ${message} - More Info: ${error}`);



            if (err instanceof DatabaseError || err instanceof ServiceError) {
                Sentry.captureException(err.toString());
            }

            return res.status(statusCode).send({
                route: route,
                message: message,
                statusCode: statusCode,
                error: error,
                type: name
            })


        } else {
            logger.fatal(`Something went really wrong. Please check the logs out: ${err.toString()}`);
            Sentry.captureException(err.toString());

            return res.status(500).send({
                message: 'Something went really wrong, please inform yash@attentioun.com',
                statusCode: 500,
                error: err,
                type: 'FATAL ERROR'
            })
        }
    }
}