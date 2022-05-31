const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');


const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'sam';
const phone = '9315859952'
const password = 'Default@123'
let id;


/*
    Creates articleId, publicationId and user before each step. 
*/

beforeEach(async () => {
    /* This is a way to create a user and add a phone number and email to the user. */
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
    }).expect(201);
    /* This is a way to get the access token for the user. */

})


/*
Forgot Password Flow. 
1. Forgot Password using Phone. 
2. Login using new password. 
3. Forgot Password using Email. 
4. Login using new password reset in the last step. 
*/



test('Forgot password flow for Phone & Email', async () => {


    /* 

    Steps till the next comment: 
    1. Login using phone. 
    2. Reset Password using Phone.
    3. Login using phone with previous password. - get 401 
    4. Login using phone with new password - get 200. 
    5. 
    */

    await request(app).post('/onboarding/login').send({
        entity: phone,
        type: 'phone',
        password
    }).expect(200);


    let id = await mongo.security.forgotPasswordUsingPhone(phone);

    await request(app).post('/utils/resetPassword').send({
        entity: phone,
        type: "phone",
        password: 'yash@123',
        id
    }).expect(201);


    await request(app).post('/onboarding/login').send({
        entity: phone,
        type: 'phone',
        password
    }).expect(401);

    await request(app).post('/onboarding/login').send({
        entity: phone,
        type: 'phone',
        password: 'yash@123'
    }).expect(200);


    /*
    1. Login with email - get 200. 
    2. Reset password - using email. 
    3. Login with email with prev password - get 401. 
    4. Login with email with new password - get 200. 

    */
    await request(app).post('/onboarding/login').send({
        entity: email,
        type: 'email',
        password: 'yash@123'
    }).expect(200);


    id = await mongo.security.forgotPasswordUsingEmail(email);

    await request(app).post('/utils/resetPassword').send({
        entity: email,
        type: 'email',
        password: 'new-password-email',
        id
    }).expect(201);

    await request(app).post('/onboarding/login').send({
        entity: email,
        type: 'email',
        password: 'yash@123'
    }).expect(401);


    await request(app).post('/onboarding/login').send({
        entity: email,
        type: 'email',
        password: 'new-password-email'
    }).expect(200);

});






test('Bad Request - Forgot password flow for Phone & Email', async () => {


    await request(app).post('/onboarding/login').send({}).expect(400);

    let id = 'random-id';

    await request(app).post('/utils/resetPassword').send({
        entity: phone,
        password: 'yash@123',
        id
    }).expect(400);

    await request(app).post('/utils/resetPassword').send({
        entity: phone,
        type: "phone",
        password: 'yash@123',
    }).expect(400);

    await request(app).post('/utils/resetPassword').send({
        entity: phone,
        type: "phone",
        id
    }).expect(400);

    await request(app).post('/utils/resetPassword').send({
        type: "phone",
        password: 'yash@123',
        id
    }).expect(400);


    await request(app).post('/utils/resetPassword').send({
        entity: phone,
        type: "not-valid-entity",
        password: 'yash@123',
        id
    }).expect(400);


});