const express = require('express');
const Task = require('../Models/task');
const router = express.Router();

router.use(express.json());

//create task
router.post('/createTask', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


//check all the task
//filter     - allTasks?completed=true (only display completed)
//pagination - allTasks?limit=3&skip=0 (only display 3 task on the first page)
//sorting    - allTasks?sortBy=createdAt:desc or asce (desc - decending & ace - acending)

//http://localhost:3000/task/allTasks?completed=true&limit=3&skip=0 (to perform both filtering and pagination together)

router.get('/allTasks', async (req, res) => {
    const completedParam = req.query.completed;   //this will return a string of 'true' or 'false'
    const limit = parseInt(req.query.limit) || 5; //default limit is 3
    const skip = parseInt(req.query.skip) || 0;   //default limit is 0

    try {
        let filter = {}

        if (completedParam === 'true') {
            filter.completed = true;
        }
        else if (completedParam === 'false') {
            filter.completed = false;
        }

        //sorting
        let sortOption = {}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sortOption[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }


        const taskInfo = await Task.find(filter)
            .limit(limit)
            .skip(skip)
            .sort(sortOption);
        res.send(taskInfo)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


//check task by it's id
router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id)
        if (!task)
            return res.status(404).send("Task not found")

        res.send(task)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.patch('/:id', async (req, res) => {

    const updatingFields = Object.keys(req.body);
    const allowedOperation = ['description', 'completed'];

    const isValidOperation = updatingFields.every((fields) => {
        return allowedOperation.includes(fields);
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Udate!" })
    }

    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        const updatedTask = await Task.findById(req.params.id);
        updatingFields.forEach((field) => updatedTask[field] = req.body[field])
        await updatedTask.save()

        if (!updatedTask)
            return res.status(400).send(updatedTask)

        res.send(updatedTask)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id)

        if (!deletedTask) {
            return res.status(404).send("Task not found!");
        }

        res.send(deletedTask);
    }
    catch (e) {
        res.status(400).send(e);
    }
})


//file upload
const multer = require('multer');           //for file uploading we use - multer
const upload = multer({
    // dest: 'images',           //folder destination, where upload file will be store
    limits: {                 //lmiting the size of the document
        fileSize: 1000000     //1MB
    },
    // fileFilter(req, file, callback) {    //type of file -> jpg, pdf, png...doc docx..etc
    //     if(!file.originalname.match('.pdf')){
    //         return callback(new Error('please upload a pdf'))
    //     }

    //     callback(undefined, true);
    // }


    //working with regular express, to write the same above function (fileFilter())  - using regex101.com to write the regular expression
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {    //the file type could be a pdf, doc or docx
            return callback(new Error('please upload a pdf'))
        }

        callback(undefined, true);
    }

})

router.post('/fileupload/:id', upload.single('taskfile'), async (req, res) => {     //upload.single() - middleware provided by multer
    const uploadfile = await Task.findById(req.params.id);
    uploadfile.taskfile = req.file.buffer;
    uploadfile.save();

    res.send("File Uploaded Successfully!!")
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//Delete uploaded file   (another way to delete a particular field from the database)
router.delete('/deletefile/:id', async (req, res) => {

    try {
        const getTask = await Task.findById(req.params.id);
        if (!getTask) {
            return res.status(404).send({ error: "Task not found" })
        }

        getTask.taskfile = undefined;
        getTask.save();
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error" })
    }

    res.send("File Deleted");
})

//get task at client side in document formate
router.get('/getTask/:id', async (req, res) => {

    try {
        const task = await Task.findById(req.params.id);

        if (!task || !task.taskfile) {
            return res.status(404).send({ error: "Task details not found" });
        }

        res.set('Content-Type', 'application/pdf')
        res.send(task.taskfile);
    }
    catch (e) {
        return res.status(500).send({ error: "Internal server error" });
    }
})

module.exports = router;