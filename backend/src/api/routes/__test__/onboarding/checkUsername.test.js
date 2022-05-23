const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');

const email = 'test1@gmail.com';
const username = 'test-user';
const country = 'India';
const name = 'sam';
const password = 'Default@123';
const isWriter = false
let id;

describe("test if User Name is Available or not", () => {

    test("Returns 409 if a username is already in use", async () => {
        id = await mongo.security.createUserAddEmail(email);
        await request(app).post('/onboarding/createUser').send({
            username,
            email,
            password,
            name,
            country,
            isWriter,
            id
        }).expect(201);

        await request(app).get('/onboarding/checkUsername').query({
            username: username
        }).expect(409);
    })



    test('Returns a 200 if Username is available', async () => {

        await request(app).get('/onboarding/checkUsername').query({
            username: 'another-username'
        }).expect(200);

    })

    test('Returns 400 if username is empty', async () => {
        await request(app).get('/onboarding/checkUsername').query({
            username: undefined
        }).expect(400);
    })
})