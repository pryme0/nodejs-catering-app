const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const User = require('../schema/user')



let transporter = nodemailer.createTransport({
  service: 'gmail',
  port:'465',
  secure: 'false',
  auth: {
     user: 'obochi2@gmail.com',
     pass: 'nagato10'
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

