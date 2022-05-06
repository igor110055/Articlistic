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


it('Returns a 409 in case a user with username exists', async () => {

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

    await request(app).get('/onboarding/checkUsername').query({
        username: username
    }).expect(409);


})


it('Returns a 200 in case a user with username exists', async () => {

    await request(app).get('/onboarding/checkUsername').query({
        username: 'another-username'
    }).expect(200);

})