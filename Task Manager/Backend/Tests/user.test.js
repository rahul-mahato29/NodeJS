const request = require('supertest');
const app = require('../app');
const User = require('../Models/user');

const userOne = {
    name: "Mike",
    email: "mike@gmail.com",
    password: "mike@123!"
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