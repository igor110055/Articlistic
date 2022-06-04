const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');
const { initBeforeEach } = require('../init');

const email = 'test1@gmail.com';
const username = 'test-user';
const international = false;
const name = 'uchiha';
const password = 'Default@123'
let id;
const reusableObj = {
    encryptedAccessToken: null,
    publicationId: null
}
/*
    This is a test case. It is a test case that tests the `login` endpoint.
    The required inputs are: entity, password and type. 
*/

describe("Tests for login", () => {
    initBeforeEach(username, email, password, name, international, reusableObj);

    test("Returns 200 in case of Correct credentials in email", async () => {
        await request(app).post('/onboarding/login').send({
            entity: email,
            password,
            type: "email"
        }).expect(200);
    })


    test("Returns 400 in case of missing entity", async () => {
        await request(app).post('/onboarding/login').send({
            password,
            type: "email"
        }).expect(400);
    })

    test("Returns 400 in case of missing password", async () => {
        await request(app).post('/onboarding/login').send({
            entity: email,
            type: "email"
        }).expect(400);
    })

    test("Returns 400 in case of missing type", async () => {
        await request(app).post('/onboarding/login').send({
            entity: email,
            password,
        }).expect(400);
    })

    test("Returns 400 in case of inavlid type", async () => {
        await request(app).post('/onboarding/login').send({
            entity: email,
            password,
            type: "eaikey",
        }).expect(400);
    })
})

