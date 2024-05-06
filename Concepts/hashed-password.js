//hashing the password to make sure the privacy of the user

//hash is a one way process, means one a password is hased then it cannot be converted back to the plain password,
//then to check the user has the provided the correct password or not in the login, then we again hashed the provided
//password and compare with the hashed password which is there in the database, if password matches the user is authenticated.

const bcrypt = require('bcrypt')

const myFunction = async () => {
    //this way we will store the password in the database by hashing it
    const plainPassword = 'rahul123';
    const hashedPassword = await bcrypt.hash(plainPassword, 8);

    console.log(plainPassword);
    console.log(hashedPassword);

    //how we will match the password provided by the user during login credentical
    const  isMatched = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(isMatched);
}

myFunction();