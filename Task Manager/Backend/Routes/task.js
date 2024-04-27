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


    // task.save().then(() => {
    //     res.status(201).send(task)
    // })
    // .catch((e) => {
    //     res.status(400).send(e)  
    // })
})


//check all the task
router.get('/allTasks', async (req, res) => {

    try {
        const taskInfo = await Task.find({})
        res.send(taskInfo)
    }
    catch (e) {
        res.status(400).send(e)
    }

    // Task.find({}).then((taskInfo) => {
    //     res.send(taskInfo);
    // })
    // .catch((e) => {
    //     res.status(400).send(e)
    // })  
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

    // Task.findById(_id).then((task) => {
    //     if(!task)
    //         return res.status(404).send("Task not found")

    //     res.send(task)
    // })
    // .catch((e) => {
    //     res.status(400).send(e)
    // })
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
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

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