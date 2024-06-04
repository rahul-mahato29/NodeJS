const app = require('./app');
const port = process.env.PORT
console.log("System : ", process.env.PROJECT_ENV)   //will tell you, in which system you are currently working

app.listen(port, () => {
    console.log(`Port is running at ${port}`);
})