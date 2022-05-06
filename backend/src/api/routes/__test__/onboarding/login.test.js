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
    This is a test case. It is a test case that tests the `login` endpoint.
    The required inputs are: entity, password and type. 
*/
it('Returns a 400 in case of Bad Request Parameters', async () => {


    //Here the only accepted type is username, phone or email.
    await request(app).post('/onboarding/login').send({
        entity: 'something random',
        password,
        type: 'invalid type'
    }).expect(400);

    await request(app).post('/onboarding/login').send({
        password,
        type: 'username'
    }).expect(400);

    await request(app).post('/onboarding/login').send({
        entity: username,
        type: 'username'
    }).expect(400);

})


it('Returns a 200 in case correct credentials', async () => {
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


    await request(app).post('/onboarding/login').send({
        type: 'username',
        entity: username,
        password: password
    }).expect(200);



    await request(app).post('/onboarding/login').send({
        type: 'phone',
        entity: phone,
        password: password
    }).expect(200);



    await request(app).post('/onboarding/login').send({
        type: 'email',
        entity: email,
        password: password
    }).expect(200);




})

it('Returns a 401 in case wrong credentials', async () => {
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


    /*
     * Testing login with username
     * First with wrong username 
     * Second with wrong password
     */


    await request(app).post('/onboarding/login').send({
        type: 'username',
        entity: 'wrong-username',
        password: password
    }).expect(401);


    await request(app).post('/onboarding/login').send({
        type: 'username',
        entity: username,
        password: 'wrong-password'
    }).expect(401);



    /*
     * Testing login with phone
     * First with wrong phone 
     * Second with wrong password
     */

    await request(app).post('/onboarding/login').send({
        type: 'phone',
        entity: 'wrong-phone',
        password: password
    }).expect(401);



    await request(app).post('/onboarding/login').send({
        type: 'phone',
        entity: phone,
        password: 'wrong-password'
    }).expect(401);




    /*
     * Testing login with email
     * First with wrong email 
     * Second with wrong password
     */

    await request(app).post('/onboarding/login').send({
        type: 'email',
        entity: 'wrong-email',
        password: password
    }).expect(401);


    await request(app).post('/onboarding/login').send({
        type: 'email',
        entity: email,
        password: 'wrong-password'
    }).expect(401);




})