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
//filter - allTasks?completed=true (only display completed)
router.get('/allTasks', async (req, res) => {
    const completedParam = req.query.completed;   //this will return a string of 'true' or 'false'

    try {
        let filter = {}

        if (completedParam === 'true'){  
            filter.completed = true;
        }
        else if (completedParam === 'false') {
            filter.completed = false;
        }


        const taskInfo = await Task.find(filter)
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
        if(!task) 
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

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid Udate!"})
    }

    try {
        // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        const updatedTask = await Task.findById(req.params.id);
        updatingFields.forEach((field) => updatedTask[field] = req.body[field] )
        await updatedTask.save()

        if(!updatedTask)
            return res.status(400).send(updatedTask)
    
        res.send(updatedTask)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/:id', async (req, res) => {
    try{
        const deletedTask = await Task.findByIdAndDelete(req.params.id)

        if(!deletedTask) {
            return res.status(404).send("Task not found!");
        }

        res.send(deletedTask);
    }
    catch (e) {
        res.status(400).send(e);
    }
})


module.exports = router;