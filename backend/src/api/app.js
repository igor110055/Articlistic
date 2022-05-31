'use strict';

const config = require('../../config');

var express = require('express');
require('express-async-errors');
var bodyParser = require('body-parser');
var cors = require('cors');
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
var onboardingRouter = require('./routes/onboarding');
var utilitiesRouter = require('./routes/utils');
var articlesRouter = require('./routes/articles');
var writerRouter = require('./routes/writers');
var userRouter = require('./routes/users');
var publicationRouter = require('./routes/publication');
var walletRouter = require('./routes/wallet');

var errorHandlingMiddleware = require('../middleware/errors');

let app = express();


if (config.environment != 'test') {
    Sentry.init({
        dsn: config.sentry.uri,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({
                tracing: true
            }),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({
                app
            }),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}


app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());



app.use(bodyParser.json());
//Fun Fact: this isn't deprecated - it just shows it is - the package has some technical prob.

app.use(cors());



app.use('/onboarding', onboardingRouter());
app.use('/utils', utilitiesRouter());
app.use('/articles', articlesRouter());
app.use('/users', userRouter());
// app.use('/writer', writerRouter());
app.use('/publication', publicationRouter())
app.use('/wallet', walletRouter())

app.use(errorHandlingMiddleware());

module.exports = app;