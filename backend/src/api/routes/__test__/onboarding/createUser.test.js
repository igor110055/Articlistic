const app = require('../../../app')
const mongo = require('../../../../db/mongo/index')
const request = require('supertest');

const email = 'test1@gmail.com';
const username = 'test-user';
const country = 'India';
const name = 'sam';
const password = 'Default@123'
const isWriter = false
let id;

/*
    This is a test case. It is a test case that tests the `createUser` endpoint.
    First two lines add an ID on the database side which is used for Security purposes. 
    Check out Notion. 
*/
test('Returns a 201 on create user when successful', async () => {
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
})


/*
    The above code is a test case. It is a test case that tests the `createUser` endpoint. 
    The required params are - username, email, password, name, phone, id andcountry. 
*/

describe('Returns a 400 in case of missing parameters', () => {


    //Missingcountry as a param.
    test("Returns 400 in case of missing Country", async () => {
        await request(app).post('/onboarding/createUser').send({
            username,
            email,
            password,
            name,
            isWriter,
            id
        }).expect(400);
    })

    //Missing username as a param.
    test("Returns 400 in case of missing Username", async () => {
        await request(app).post('/onboarding/createUser').send({
            country,
            email,
            password,
            name,
            isWriter,
            id
        }).expect(400);
    })

    //Missing password as a param.
    test("Returns 400 in case of missing Password", async () => {
        await request(app).post('/onboarding/createUser').send({
            country,
            email,
            username,
            name,
            isWriter,
            id
        }).expect(400);
    })


    //Missing name as a param.
    test("Returns 400 in case of missing Name", async () => {
        await request(app).post('/onboarding/createUser').send({
            country,
            email,
            username,
            password,
            isWriter,
            id
        }).expect(400);
    })
    //Missing id as parameter
    test("Returns 400 in case of missing id", async () => {
        await request(app).post('/onboarding/createUser').send({
            country,
            email,
            username,
            name,
            isWriter,
            password
        }).expect(400);
    })

    //Missing isWriter as Parameter
    test("Returns 400 in case of missing isWriter", async () => {
        await request(app).post('/onboarding/createUser').send({
            country,
            email,
            username,
            name,
            id,
            password
        }).expect(400);
    })

});



/*
    The above code is a test case. It is a test case that tests the `createUser` endpoint. 
    500 Error comes in case the user has same email/phone and username. This confirms that our uniqueness index works.  
*/

describe('Returns a 409 in case there is duplication of email/username', () => {

    //email duplicacy
    test("Return 409 if Email already exist", async () => {
        id = await mongo.security.createUserAddEmail(email)
        await request(app).post("/onboarding/createUser").send({
            username,
            email,
            password,
            name,
            country,
            isWriter,
            id
        }).expect(201);

        await request(app).post("/onboarding/email/sendOTP").query({
            email
        }).expect(409)
    })

    //if username exist
    test("Return 409 if Username already exist", async () => {
        id = await mongo.security.createUserAddEmail(email);

        await request(app).get("/onboarding/checkUsername").query({
            username: "whiteFang"
        }).expect(200)

        await request(app).post("/onboarding/createUser").send({
            username: "whiteFang",
            email,
            password,
            name,
            country,
            isWriter,
            id
        }).expect(201);

        await request(app).get("/onboarding/checkUsername").query({
            username: "whiteFang"
        }).expect(409)
    })
});