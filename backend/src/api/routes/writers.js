var express = require('express');

// require('../../errors/customError');

var mongo = require('../../db/mongo/index');
const logger = require('../../utils/logger/index')

const useAuth = require('../../middleware/auth')

const NetworkError = require('../../errors/NetworkError');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const ServiceError = require('../../errors/ServiceError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const checkDb = require('../../middleware/checkDb');


module.exports = function writerRouter() {

    return new express.Router()
        .get('/getWriter', useAuth(), checkDb(false, true), getWriter)
        .post('/newWriter', useAuth(), newWriter)
        .post('/removeCategory', useAuth(), checkDb(false, true), removeCategoryForWriter);

    async function removeCategoryForWriter(req, res) {
        let routeName = 'writer/removeCategory'
        let writer = req.writer;

        let {
            category
        } = req.query;

        try {
            await mongo.writers.removeWriterCategory(writer, category);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            'message': 'Success.'
        })

    }

    async function newWriter(req, res) {
        let routeName = 'writer/newWriter';

        let {
            username,
            description,
            categories,
            image,
            name
        } = req.body;

        try {
            var writer = await mongo.writers.insertWriter(username, description, categories, image, name)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        res.status(201).send({
            message: 'Success',
            writer
        });

    }


    async function getWriter(req, res) {
        let routeName = 'writer/getWriter';

        let writerUsername = req.writer;
        let username = req.username;


        try {
            var writer = await mongo.writers.getWriterByName(writerUsername);
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        try {
            await mongo.analytics.updateAnalyticsForWriterFetch(username, writerUsername)
        } catch (e) {
            throw new DatabaseError(routeName, e);
        }

        return res.status(200).send({
            message: 'Successfully fetched writer',
            writer
        });

    }

}