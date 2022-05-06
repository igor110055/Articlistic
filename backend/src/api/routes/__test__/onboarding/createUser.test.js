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
    This is a test case. It is a test case that tests the `createUser` endpoint.
    First two lines add an ID on the database side which is used for Security purposes. 
    Check out Notion. 
*/
it('Returns a 201 on create user when successful', async () => {
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


})


/*
    The above code is a test case. It is a test case that tests the `createUser` endpoint. 
    Whenever the CreateUser API is used - an ID is required for Security Purposes. 

*/

it('Returns 500 in case verification is not complete ', async () => {

    //Trying to create a user with same phone. 
    await request(app).post('/onboarding/createUser').send({
        username: 'tester-dixit',
        email: 'yash@gmail.com',
        password,
        phone,
        name,
        international,
        id
    }).expect(500);

    //Trying to create a user with same email. 
    await request(app).post('/onboarding/createUser').send({
        username: 'tester-dixit',
        email,
        password,
        phone: '9832919928',
        name,
        international,
        id
    }).expect(500);

})

/*
    The above code is a test case. It is a test case that tests the `createUser` endpoint. 
    The required params are - username, email, password, name, phone, id and international. 
*/

it('Returns a 400 in case of missing parameters', async () => {


    //Missing international as a param.
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        name,
        id
    }).expect(400);

    //Missing username as a param.
    await request(app).post('/onboarding/createUser').send({
        email,
        password,
        phone,
        name,
        international,
        id
    }).expect(400);

    //Missing phone as a param.
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        name,
        international,
        id
    }).expect(400);


    //Missing password as a param.
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        phone,
        name,
        international,
        id
    }).expect(400);


    //Missing name as a param.
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        international,
        id
    }).expect(400);

    //Missing id as parameter
    await request(app).post('/onboarding/createUser').send({
        username,
        email,
        password,
        phone,
        international,
        name
    }).expect(400);

});



/*
    The above code is a test case. It is a test case that tests the `createUser` endpoint. 
    500 Error comes in case the user has same email/phone and username. This confirms that our uniqueness index works.  
*/

it('Returns a 500 in case there is duplication of email/phone/username', async () => {});