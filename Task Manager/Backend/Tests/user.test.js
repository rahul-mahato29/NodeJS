const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../Models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@gmail.com",
    password: "mike@123!",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();   //this is for checking login-credentials
})

//eveytime it is testing the registeration, it is sending a mail to a unknow user-rahu123@gmail, and if we are using any paid subscription for sending mail, the it will coast us, 
//so to avoid this, we are using mock-library to stop sending mail during the testing.
test('Register-User', async () => {
    const response = await request(app).post('/user/registerUsers').send({
        "name": "Rahul Mahato",
        "email": "rahul123@gmail.com",     //email should be unique, then only it will work - according to userShcema (to resolve this issue - we will use "beforeEach() function")
        "password": "Rahul@123!",
        "age": 22
    }).expect(200)   //here 200 is the success status code.

    // Assert that the database was changed correctly, ensure we get back the users details after registeration
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Rahul Mahato',
            email: 'rahul123@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Rahul@123!')
})

test('Login-User', async () => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Not-Login-User', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: "WrongPassword"
    }).expect(400)
})

test('Get-All-User', async () => {
    await request(app)
        .get('/user/allUsers')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Unauthenticated-User', async () => {
    await request(app)
        .get('/user/allUsers')
        .send()
        .expect(400)
})

test('Get-User-By-Id', async () => {
    await request(app)
        .get(`/user/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Delete-User-Account-By-Id', async () => {
    await request(app)
        .delete(`/user/${userOneId}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Not-Delete-Unauthorized-User', async () => {
    await request(app)
        .delete(`/user/${userOneId}`)
        .send()
        .expect(400)
})

// test('Upload-profile-picture', async () => {
//     await request(app)
//         .post(`/user/UpdateProfileImg/${userOneId}`)
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar', './Tests/fixtures/DataModel-Todo.jpg')
//         .expect(200)
// })