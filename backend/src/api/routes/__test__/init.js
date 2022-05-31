const app = require('../../app')
const mongo = require('../../../db/mongo/index')
const request = require('supertest');
const logger = require('../../../utils/logger');

const fs = require('fs');
const path = require('path');

const {
    jwt,
    decryptForFrontend,
    encrypt
} = require('../../../utils/encryption');

function initBeforeEach(username, email, password, name, international, reusableObj, twoUsers, isUser) {

    let country;
    if (international) {
        country = "United States";
    } else {
        country = "India";
    }

    let isWriter = false;

    if (!isUser) {
        isWriter = true;
    }

    beforeEach(async () => {
        /* This is a way to create a user and add a phone number and email to the user. */
        const id = await mongo.security.createUserAddEmail(email);
        await request(app).post('/onboarding/createUser').send({
            id,
            username,
            email,
            password,
            name,
            international,
            country,
            isWriter
        });
        /* This is a way to get the access token for the user. */

        let accessToken = jwt.sign(username);
        accessToken = await decryptForFrontend(accessToken);
        reusableObj.encryptedAccessToken = encrypt(accessToken);


        /*
         * This is used to create a publication with images. 
         * Which will in turn be used by the get API in the response.
         */

        const res = await request(app).post('/publication/').query({
                name: 'My First Publication'
            })
            .set('Authorization', reusableObj.encryptedAccessToken).expect(201);

        reusableObj.publicationId = res.body.publicationId;




    })

}


module.exports = {
    initBeforeEach
}