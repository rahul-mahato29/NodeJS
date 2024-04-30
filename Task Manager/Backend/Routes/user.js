const express = require('express');
const router = express.Router();
const User = require('../Models/user')

router.use(express.json()); 

//create user
router.post('/registerUsers', async (req, res) => {
    const user = new User(req.body);

    //handling all the promise using async-await instead we were doing previously, we can check below we were handling it before.
    try {
        await user.save()
        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


//check all the users
router.get('/allUsers', async (req, res) => {

    try {
        const userInfo = await User.find({})
        res.send(userInfo)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


//check indivisual user by thier id
router.get('/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)
        if(!user){ //if no user is present with this id
            return res.status(404).send("User not found!");
        }

        res.send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})


//update users information
router.patch('/:id', async (req, res) => {
    //Error handling
    const updates = Object.keys(req.body);  //return an array of all the fields that we are trying to update
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    //The every() method executes a function for each array element.
    const isValidOperation = updates.every((updateField) => {
        return allowedUpdates.includes(updateField);  //checking each field that we are trying to update is valid or not, means we are allowed to update that filed or not by checking it into allowedUpdates array.
    })

    if(!isValidOperation){
        return res.status(400).send({error : 'Invalid Update!'})
    }
    

    try {      
        //new approach, with the below approach - middleware for password converting to hash will not work, because we are not using save() and that middle ware will do precheck only for save().

        const updatedUser = await User.findById(req.params.id);
        updates.forEach((update) => updatedUser[update] = req.body[update])
        await updatedUser.save()
        
        //(options) new - create a new user and runValidators will validate the updates that I am doing, if I am updating anything not present then it will throw an error.
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true,})

        if(!updatedUser) {
            res.status(404).send("User not found!");
        }

        res.send(updatedUser)
    }
    catch (e) {
        res.status(400).send(e)
    }
})  


router.delete('/:id', async (req, res) => {    
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if(!deletedUser){
            return res.status(400).send("User not found");
        }

        res.send(deletedUser);
    }
    catch (error) {
        res.status(400).send(error);
    }
})


//upload profile picture
const multer = require('multer');
const upload = multer({
    dest: 'images', 
    limits: {
        fileSize: 1000000
    },
    fileFilter (req,file , callback) {
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)) {            //regular express, you can also use or condition in the if-expression, if not comfortable with this express.
            console.log("check")
            return callback(new Error(' file should be png/jpg/jpeg'))
        }

        callback(undefined, true);
    }
})  

router.post('/profileImg', upload.single('profilePic'), (req, res) => {
    res.send('Profile Picture uploaded successfully');
})



module.exports = router;