const moment = require('moment');
const {
    v4: uuid
} = require('uuid')
const db = require('../../Model');
const emailverification = db.Emailverification;
const emailModule = require('../../Mail/Nodemailer');
const winston = require('winston');
const scheduler = require('node-schedule');
const config = require('config');
module.exports = async function (req, res, id, email, name) {

    const mailOptions = {
        from: config.get('Email_env.email'),
        to: email,
        subject: 'Account Credentials',
        html: `<h1 style="color:#000;font-weigth:bold">Your Account Credentials Are</h1>
        <br/>
        <img src="cid:unique@kreata.ee"/>
        <h2 style="color:#000;font-size:15px;font-weigth:bold"> Hey, ${name} </h2>
        <p style="color:#000;font-size:15px;font-weigth:bold">Email :  ${email} </p>
        <p style="color:#000;font-size:15px;font-weigth:bold">Password :  ${config.get('Default_password.password')}</p>
        <p style="color:#000;font-size:15px;font-weigth:bold">Password Reset Link: Comming Soon`,
        attachments: [{
            filename: 'Cloud-IAM.png',
            path: 'https://www.jhanley.com/wp-content/uploads/2018/12/Cloud-IAM.png',
            cid: 'unique@kreata.ee'
        }]
    };

    let sendEmail = await emailModule
        .sendMail(mailOptions)
    if (sendEmail) {
        console.log("Email Sent");
    } else {
        console.log("Error");
    }
}