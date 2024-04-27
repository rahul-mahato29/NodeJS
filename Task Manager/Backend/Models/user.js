const validator = require('validator');
const mongoose = require('mongoose');

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
        validate(value) {   
            if(!validator.isEmail(value)){     //validator.isEmail - check npm validator - external library
                throw new error('Email is invalid')
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
                throw new error('password cannot contain "password"')  //and islowercase to check password must be in lowercase only.
            }
        }
    },
    age: {
        type: Number,
        default: 0,     //if no-input then, by default age will zero
        validate(value) {
            if(value < 0){
                throw new erro('age must be a positive number')
            }
        }
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;


//mongoose has only limited in-built validator, for complex validation we can created our own custom validator using "validate() function"
//for more complex validation : check (npm validator library)
