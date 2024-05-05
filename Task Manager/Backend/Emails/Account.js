//using https://www.nodemailer.com/ and https://ethereal.email/ for sending mail testing
const nodemailer = require("nodemailer");


let testAccount = nodemailer.createTestAccount();

//connect with stmp (ethereal)
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: 'una.wiza@ethereal.email',
        pass: 'hvSdBVnfvCy7RZgkbz'
    },
});

const sendWelcomeEmail = async (name) => {

    // Message object
    let message = await transporter.sendMail({
        from: 'Rahul Mahato <rahul@gmail.com>',
        to: ' <mahatorahul2901@gmail.com>',
        subject: 'Welcome to our application!!',
        text: `Hello ${name}!`,
    });


    console.log("Message sent: %s", message.messageId);
}

const sendCancellationEmail = async (name) => {
    
    // Message object
    let message = await transporter.sendMail({
        from: 'Rahul Mahato <rahul@gmail.com>',
        to: ' <mahatorahul2901@gmail.com>',
        subject: 'Very Sad, you are leaving us!!',
        text: `bye ${name}!`,
    });


    console.log("Message sent: %s", message.messageId);
    
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};