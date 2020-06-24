const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const User = require('../schema/user')
const mailpass = process.env.EMAIL_PASSWORD
const userEmail = process.env.USER_EMAIL


let transporter = nodemailer.createTransport({
  service: 'gmail',
  port:'465',
  secure: 'false',
  auth: {
     user: userEmail,//input your email here
     pass: mailpass//input your email password here
 },
  tls: {
      rejectUnauthorized: false
 }
 })


exports.MailPasswordLink = async(options)=>{
 await transporter.sendMail(options, function(error, info){
        if (error) {
          console.log(error)
          return ("password reset unsucessfull" + error)
        } else {
          console.log(info)
          console.log('Email sent: ' + info.response);
        }
      });
}

