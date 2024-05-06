const User = require('../Models/user')
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');  //removing Bearer-space
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id})

        if(!user){
            throw new Error();
        }

        req.token = token
        req.user = user    //for reusing this in any route, instead of sending the user details to the body again.
        next();
    }
    catch(e){
        res.status(400).send({error: 'Please Authenticate'})
    }
}

module.exports = auth;  