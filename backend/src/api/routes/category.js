const express = require('express');
const mongo = require('../../db/mongo/index')
const encryption = require('../../utils/encryption/index');
const logger = require('../../utils/logger');
const {
    v4: uuidv4
} = require('uuid');

const useAuth = require('../../middleware/auth')
const otp = require('../../utils/otp/index');
const MissingParamError = require('../../errors/MissingParamError');
const DatabaseError = require('../../errors/DatabaseError');
const NotAuthenticatedError = require('../../errors/NotAuthenticatedError');
const NetworkError = require('../../errors/NetworkError');
const ServiceError = require('../../errors/ServiceError');
const checkDb = require('../../middleware/checkDb');

module.exports = function utilitiesRouter() {

    return new express.Router()

}