const request = require('supertest');
const app = require('../app');

test('Register-User', async () => {
    await request(app).post('/user/registerUsers').send({
        "name": "Rahul Mahato",
        "email": "rahul123@gmail.com",     //email should be unique, then only it will work - according to userShcema
        "password": "Rahul@123!",
        "age": 22
    }).expect(200)
})  
