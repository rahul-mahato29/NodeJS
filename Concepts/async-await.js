const { User } = require("../Task Manager/Backend/Database/db");


//Below we are updating the age, and find the total number of users having updated age using Promise-chaining.

// User.findByIdAndUpdate('662aa2be410a8d3d99801cbf', {age : 1}).then((user) => {
//     console.log(user);

//     return User.countDocuments({age : 1})   
// })
// .then((result) => {
//     console.log(result);
// })/
// .catch((error) => {
//     console.log(error); 
// })                       


//Implementing the same as above requirement - updating the age and find the total number of user having the same age.
//Using async-await method

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, {age})   //findByIdAndUpdate will return a promise
    // console.log(user);
    const count = await User.countDocuments({age})         //countDocument will return a promise
    return count;
}

updateAgeAndCount('662aa2be410a8d3d99801cbf', 20).then((count) => {
    console.log(count);
})  
.catch((e) => {
    console.log(e);
})
