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



/*
 * PUT /publication/
 */

it('Responds 200 in case successful edit with appropriate response', async () => {

    //First let's create a user and a publication to his name - This is the init setup. 
    id = await mongo.security.createUserAddPhone(phone);
    await mongo.security.createUserAddEmail(email);
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
    let encryptedAccessToken = encrypt(accessToken);

    let re = await request(app).post('/publication/').query({
        name: 'My First Publication'
    }).set('Authorization', encryptedAccessToken).expect(201)

    const publicationId = re.body.publicationId;


    /*
     *First test is for one without picture and a returns a publication id.
     *Second one is with a picture returns a publication id and publication pic link. 
     */


    let updateName = 'EditedPublication';

    const idResponse = await request(app).put('/publication/').query({
        name: updateName,
        publicationId: publicationId
    }).set('Authorization', encryptedAccessToken).expect(200)

    expect(idResponse.body.publicationName == updateName);

    let updateName2 = 'Edited Publication 2'
    const pictureResponse = await request(app).put('/publication/').query({
            name: updateName2,
            publicationId
        }).attach('image', path.resolve(__dirname, '../test.jpg'))
        .set('Authorization', encryptedAccessToken).expect(200);


    expect(pictureResponse.body.publicationName).toBe(updateName2);
    expect(pictureResponse.body.publicationPic).toBeDefined();




});
it('Responds 401 in case any other user than owner tries to update publication', async () => {




});
it('Responds 400 in case of wrong/bad parameters', async () => {

    //First let's create a user and a publication to his name - This is the init setup. 
    id = await mongo.security.createUserAddPhone(phone);
    await mongo.security.createUserAddEmail(email);
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
    let encryptedAccessToken = encrypt(accessToken);

    let re = await request(app).post('/publication/').query({
        name: 'My First Publication'
    }).set('Authorization', encryptedAccessToken).expect(201)

    const publicationId = re.body.publicationId;

    await request(app).put('/publication/').query({
        publicationId: publicationId
    }).set('Authorization', encryptedAccessToken).expect(400)

    await request(app).put('/publication/').query({
        name: 'New name'
    }).set('Authorization', encryptedAccessToken).expect(400)


    await request(app).put('/publication/').query({}).set('Authorization', encryptedAccessToken).expect(400)


});