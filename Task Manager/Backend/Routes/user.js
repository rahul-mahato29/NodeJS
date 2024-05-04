const express = require('express');
const router = express.Router();
const User = require('../Models/user')
const sharp = require('sharp');

const { sendWelcomeEmail, sendCancellationEmail } = require('../Emails/Account');   //it will show like an error line, but it's not an error

router.use(express.json());

//create user
router.post('/registerUsers', async (req, res) => {
    const user = new User(req.body);

    //handling all the promise using async-await instead we were doing previously, we can check below we were handling it before.
    try {
        await user.save()
        res.send(user)
        sendWelcomeEmail(user.name);
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
        if (!user) { //if no user is present with this id
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

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Update!' })
    }


    try {
        //new approach, with the below approach - middleware for password converting to hash will not work, because we are not using save() and that middle ware will do precheck only for save().

        const updatedUser = await User.findById(req.params.id);
        updates.forEach((update) => updatedUser[update] = req.body[update])
        await updatedUser.save()

        //(options) new - create a new user and runValidators will validate the updates that I am doing, if I am updating anything not present then it will throw an error.
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true,})

        if (!updatedUser) {
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

        if (!deletedUser) {
            return res.status(400).send("User not found");
        }

        sendCancellationEmail(deletedUser.name);
        res.send(deletedUser);
    }
    catch (error) {
        res.status(400).send(error);
    }
})


//upload profile picture
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {            //regular express, you can also use "or" condition in the if-expression, if not comfortable with this express.
            return callback(new Error(' file should be png/jpg/jpeg'))
        }

        callback(undefined, true);
    }
})

router.patch('/UpdateProfileImg/:id', upload.single('avatar'), async (req, res) => {
    const updateProfile = await User.findById(req.params.id);

    //using sharp-library for resizing the image and converting to a particular formate (here we are converting all the images to png)
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    updateProfile.avatar = buffer;                                 //data will be accessable on req.file.buffer (file-property)
    updateProfile.save()                                                    //saving it to the user.profileImg (database)

    res.send('Profile Picture uploaded successfully');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



//delete profile picture   (The "$unset" operator deletes a particular field.)
router.delete('/deleteProfile/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "user not found" })
        }

        await user.updateOne({ $unset: { avatar: "" } })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error" })
    }

    res.send("Profile picture deleted")
})


//get the profile picture in URL-formate,so that client can access it and see the image.
router.get('/getProfile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            return res.status(404).send({ error: "User Data not find" });
        }

        res.set('Content-Type', 'image/jpg')     //refer below
        res.send(user.avatar)
    }
    catch (e) {
        return res.status(500).send({ error: "Internal server error" })
    }
})

module.exports = router;



// res.set('Content-Type', 'image/jpg)

// The res.set('Content-Type', 'image/jpg') statement is used to set the HTTP response header Content-Type to indicate
// the type of content being sent back to the client. In this case, it's being set to 'image/jpg', which specifies that
// the content being sent is an image in JPEG format.

// When a client (such as a web browser) receives a response from a server, it looks at the Content-Type header to
// determine how to handle the content. For example, if the Content-Type is set to 'image/jpg', the client knows that
// it's receiving an image in JPEG format, and it can display it accordingly.

// So, when you use res.set('Content-Type', 'image/jpg'), you're essentially telling the client that the response contains
// an image in JPEG format, allowing it to interpret and display the content correctly.