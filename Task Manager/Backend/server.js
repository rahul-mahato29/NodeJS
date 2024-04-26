const express = require('express');
const app = express();
const port = 3000;

const UserRoutes = require('./Routes/user');
const TaskRoutes = require('./Routes/task');

app.use('/user', UserRoutes);
app.use('/task', TaskRoutes);


app.listen(port, () => {
    console.log(`Port is running at ${port}`);
})