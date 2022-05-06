const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');
const logger = require('../../../../utils/logger');

const fs = require('fs');
const path = require('path');

const {
    jwt,
    decryptForFrontend,
    encrypt
} = require('../../../../utils/encryption');

const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'
let id;
let encryptedAccessToken;
let publicationId;


beforeEach(async () => {
    /* This is a way to create a user and add a phone number and email to the user. */
    id = await mongo.security.createUserAddEmail(email);
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        name,
        international,
        id
    });
    /* This is a way to get the access token for the user. */

    let accessToken = jwt.sign(username);
    accessToken = await decryptForFrontend(accessToken);
    encryptedAccessToken = encrypt(accessToken);


    /*
     * This is used to create a publication with images. 
     * Which will in turn be used by the get API in the response.
     */

    const res = await request(app).post('/publication/').query({
            name: 'My First Publication'
        })
        .set('Authorization', encryptedAccessToken).expect(201);

    publicationId = res.body.publicationId;

})


it('Responds 201 in case of image embed uploaded', async () => {

    await request(app).post('/publication/article/image').query({
            publicationId: publicationId
        })
        .attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(201);

});

it('Responds 400 in case of bad/missing parameters', async () => {

    await request(app).post('/publication/article/image').query({})
        .attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(400);


    await request(app).post('/publication/article/image').query({
            publicationId
        })
        .set('Authorization', encryptedAccessToken).expect(400);


    await request(app).post('/publication/article/image').query({})
        .set('Authorization', encryptedAccessToken).expect(400);

});



it('Responds 401 in case intruder tries to upload picture for publication', async () => {

    let accessToken = jwt.sign('some-other-username');
    accessToken = await decryptForFrontend(accessToken);
    let intruderToken = encrypt(accessToken);

    await request(app).post('/publication/article/image').query({
            publicationId
        })
        .attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', intruderToken).expect(401);

});