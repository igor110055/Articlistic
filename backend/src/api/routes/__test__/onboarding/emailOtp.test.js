const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');
const e = require('cors');

const email = 'test1@gmail.com';
const name = 'zeref';
const password = 'Default@123'
const username = 'test-user';

test('Return 200 if OTP sent successfully', async () => {
    await request(app).post('/onboarding/email/sendOTP').query({
        email: email
    }).expect(200);

})

test('Return 400 if email is missing', async () => {
    await request(app).post('/onboarding/email/sendOTP').query({
        email: undefined
    }).expect(400);

})
test('Return 409 if email already present', async () => {
    id = await mongo.security.createUserAddEmail(email);
    await request(app).post("/onboarding/createUser").send({
        username,
        email,
        password,
        name,
        country: "India",
        isWriter: false,
        id
    }).expect(201);

    await request(app).post('/onboarding/email/sendOTP').query({
        email: email
    }).expect(409);

})
