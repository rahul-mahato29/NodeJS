//implementing promise chaining in our project,
//Requirment : update the age of the user and find total number of users having that updated age.

//promise-1 : update the age : 1, for provided user_id
//Promise-2 : return the total number of users having age = 1

const { User } = require("../Database/db");

//findByIdAndUpdate - check mongoose NPM
User.findByIdAndUpdate('662aa2be410a8d3d99801cbf', {age : 1}).then((user) => {
    console.log(user);

    return User.countDocuments({age : 1})    //returning another promise using the result of prvoius promise.
})
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.log(error); 
})


//updateing the age ---> counting number of users of updated age.