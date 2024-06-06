const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        // lowercase: true,
        validate(value) {   
            if(!validator.isEmail(value)){     //validator.isEmail - check npm validator - external library
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {             //to check the "password" word is present or not, we used include() function.
                throw new Error('password cannot contain "password"')  //and islowercase to check password must be in lowercase only.
            }
        }
    },
    age: {
        type: Number,
        default: 0,     //if no-input then, by default age will zero
        validate(value) {
            if(value < 0){
                throw new Error('age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//deleting the password and tokens from the response
// The toJSON method can be used to customize the JSON representation of an object.
// The toJSON method is called automatically by JSON.stringify. And when we send or receive any request/response then JSON.stringify() get called, so this time only this "toJSON" also get called.
UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject 
}

//defining a function for generating a jwt-token
UserSchema.methods.generateAuthToken = async function() {
    const user = this;  //this will return all the details of the user who register
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token});    //user.token will be empty from the user-details that we get from "this"-keyword, here we are concatinating the generated token
    await user.save();

    return token;
}


//definging a custom function to check the provided email and password for login is correct or not
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})  //check this is present in database or not. (User defined below)

    if(!user){
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user;
}


// middleware provided by mongoose - hash the plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();  //check, even it is working after commenting out next()
})



const User = mongoose.model('User', UserSchema);

module.exports = User


//mongoose has only limited in-built validator, for complex validation we can created our own custom validator using "validate() function"
//for more complex validation : check (npm validator library)
