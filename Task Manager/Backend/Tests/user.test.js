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

test('Register-User', async () => {
    await request(app).post('/user/registerUsers').send({
        "name": "Rahul Mahato",
        "email": "rahul123@gmail.com",     //email should be unique, then only it will work - according to userShcema (to resolve this issue - we will use "beforeEach() function")
        "password": "Rahul@123!",
        "age": 22
    }).expect(200)   //here 200 is the success status code.
})

test('Login-User', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
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
})

test('Not-Delete-Unauthorized-User', async () => {
    await request(app)
        .delete(`/user/${userOneId}`)
        .send()
        .expect(400)
})