const express = require('express');
require('./Database/db')                 //setting connectivity between server and database
const app = express();
const port = process.env.PORT
console.log("System : ", process.env.PROJECT_ENV)   //will tell you, in which system you are currently working

const UserRoutes = require('./Routes/user');
const TaskRoutes = require('./Routes/task');

app.use('/user', UserRoutes);
app.use('/task', TaskRoutes);


app.listen(port, () => {
    console.log(`Port is running at ${port}`);
})