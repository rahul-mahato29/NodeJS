//Task : 
// 1. create a file of name promise_task.js 
// 2. import the Task from database
// 3. remove a given task by id 
// 4. get and print the total number of incomplete task 
// 5. test your work

const { Task } = require("../Database/db");

//promise-1 : deleting the task of given id.
//promise-2 : counting all the task which is not completed.


// Task.deleteOne({_id: "662ab38e9b0909612cc6e02c"}).then((task) => {
//     console.log(task);

//     return Task.countDocuments({completed : false})
// })
// .then((result) => {
//     console.log(result);
// })
// .catch((error) => {
//     console.log(error)
// })


//another way

Task.findByIdAndDelete('662ab38e9b0909612cc6e02c').then((task) => {
    console.log(task);

    return Task.countDocuments({completed: false})
})
.then((result) => {
    console.log(result);
})
.catch((error) => {
    console.log(error)
})