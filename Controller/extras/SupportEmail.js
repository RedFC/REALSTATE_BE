const moment = require('moment');
const {v4: uuid} = require('uuid')
const db = require('../../Model');
const support = db.Supportmodel;
const emailModule = require('../../Mail/Nodemailer');
const winston = require('winston');
const scheduler = require('node-schedule');
const config = require('config')
module.exports = async function (res, id, email, name, question) {

    let supportschema = {
        userId: id,
        email: email,
        number: null,
        question: question
    };

    let createed = await support.create(supportschema);
    if (createed) {

        const mailOptions = {
            from: config.get('Email_env.email'),
            to: config.get('Email_env.email'),
            subject: 'Client Question For Support',
            html: ` <h1>Question Alert !!</h1>
        <br/>
        <h2> From, ${name} </h2>
        <p>Question: "${question}"</p>
        <p>replyTo: "${email}"</p> `
        };

        let sendemail = await emailModule.sendMail(mailOptions)
        if (sendemail) {
            res.send({
                message: "Your Question Has Been Delivered check Your Email For The Response Within 24 h" +
                        "ours"
            })
        }

    }

}