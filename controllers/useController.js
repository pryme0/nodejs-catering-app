const express = require('express')
const Use = require('../schema/user')
const Products = require('../schema/products')
const bodyParser = require('body-parser')
const Blog = require('../schema/blog')
const path = require('path')
const bcrypt = require('bcryptjs')
const mailer = require('../config/mail')
const jwt = require('jsonwebtoken')
const Order = require('../schema/order')
const Contact = require('../schema/contactUs')



//render user registration page
exports.renderRegister = async(req, res) => {
    if (!req.header.token) {
        userId = null
        res.render('register', {
            userId
        }) 
    }
    else {
        userId = req.header.token
         res.redirect('/')
       } 
}



//render checkout page
exports.renderCheckout = async(req, res) => {
    if (!req.header.token) {
         res.redirect('/user/login')
     }
     else {
         console.log("hello world")
         userId = req.header.token
         res.render('checkout', { userId })
        } 
 }
//renderlogin page
 exports.renderLogin = async(req, res) => {
    if (!req.header.token || req.header.token === undefined) {
        userId = null
        res.render('login', { userId })

    } else {
        userId = req.header.token
        return res.redirect('/')
    }
}

//render dashboard

exports.renderDashboard = async(req, res) => {
    if (!req.token) {
        userId = null
    } else {
        userId = req.token
    }
    //userPhoto = user.profilepic
    res.render('dashboard', {
        userId
    })
}

//render Admin page
exports.renderAdmin = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('admin', {
        userId
    })
}


exports.renderSucessfulPayment = async(req, res) => {
   let order  = await await Order.findById(req.params.id).populate()
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('paystatus', {
        userId,
    order
    })
}

exports.renderPasswordReset = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('resetpassword', {
        userId
    })
}
exports.renderSetNewPassword = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('setnewpassword', {
        userId
    })
}

exports.renderContact = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('contact', {
        userId
    })
}


exports.renderIndex = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('index', {
        userId
    })
}



//create User function
exports.createUser = async(req, res) => {
    try {
        let { email } = req.body
            //check if user already exists
        let check = await Use.findOne({ email: email })
        if (check != null) {
            return res.status(401).json({
                status: "Account already exists"
            })
        } else {
            const isAdmin = false
            const userN = new Use(req.body)
            const token = await userN.generateToken();
            if (userN !== null) {
                return res.status(201).json({
                    status: 'Success!',
                    userN,
                    token
                });
            }
        }

        throw new Error('Unable to create account');
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: 'Account not created!',
            error
        });
    }

}
exports.LoginUser = async(req, res) => {
    if (req.header.token !== undefined) {
        return res.status(201).json({
            status: "Already logged in"
        })
    }
    try {
        //setting email and password
        const redirect = req.headers.redirectTo
        req.headers.redirectTo = null 
        let { email, password } = req.body
            //checking usser email and password
        const finduser = await Use.findByLoginCredentials(email, password)
        if (finduser.status !== "failed") {
            const token = await finduser.generateToken();
            req.header.token = token
            req.header.user = finduser
            res.status(200).json({
                status: 'login successful',
                finduser,
                redirect,
                token
            });
        } else {
            res.status(401).json({
                status: finduser.status,
            });
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 'Login failed check email and password',
            error: error
        });
    }
};

exports.logoutUser = async(req, res) => {
    try {
        if (req.header.token === undefined) {
            return res.redirect('/')
        }
        const token = req.header.token.replace('Bearer', '')
        const decode = jwt.verify(req.header.token, process.env.JWT_SECRET)
        const checkuser = await Use.findById({ _id: decode._id })
        await checkuser.updateOne({ 'tokens.token':{'token':undefined}})
        req.header.token = undefined;
        return res.redirect('/')
    } catch (error) {
        console.log("error" + error)
        res.status(500).json({
            Status: 'Fail to logout',
            error
        });
    }
};



exports.getProfile = async(req, res) => {
    res.status(200).json({
        status: 'Success',
        user: req.user
    });
};

exports.updateUser = async(req, res) => {
    const updatesProvidedByUser = Object.keys(req.body);
    const allowedUpdates = ['name', 'password','email','profilePic'];
    const isValidOperation = updatesProvidedByUser.every((update) => {
        return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
        return res.status(400).json({
            status: 'Error',
            message: 'Invalid Updates provided'
        });
    }
    try {
        updatesProvidedByUser.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        res.status(200).json({
            status: 'Success',
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            error
        });
    }
};



exports.deleteUser = async(req, res) => {
    let id = req.params.id
    id = id.substr(1)
    const del = await Use.findById(id).deleteOne()
    if (del) {
        const newuser = await Use.find({})
        return res.status(200).json({ newuser, status: 'success' })
    } else {
        return res.json({ status: 'failed' })
    }
}

exports.uploadPic = async(req,res)=>{
    const  image  = req.files.profilepic
let imageName = image.name
    let user = await Use.findById(req.headers.authorization)
    if(!user){
        return res.json("upload failed")
    }else{
        let splited = imageName.split(".")
        let extension = splited[1]
        image.mv(path.resolve(__dirname, "../", "public/profilepic", user.fullname + "." + extension), () => {
            user.updateOne({profilepic: `/profilepic/${user.fullname }` + "." + extension }, (error, post) => {
                if (error) {
                    console.log(error)
                    return res.json({message:'pic upload failed',status:"failed"})
                } else {
                    return res.json({user,status:"sucess"})
                }
            })
        })
    }
}


exports.sendPasswordResetMail = async(req,res)=>{
    let {email} = req.body
    let emailUser = await Use.findOne({email:email})
    if(!emailUser){
        return res.json("Email  not registered")
    }else{
        let token = jwt.sign({_id:emailUser._id.toString()},process.env.JWT_SECRET,{expiresIn:"15 min"})
        emailUser.passwordResetToken = token
        emailUser.passwordResetExpires = Date.now()+900000 //15 minutes
        emailUser.save(async (error,emailUser)=>{
            if(!error){
        let mailOptions = {
            to:emailUser.email,
            from:"obochi2@gmail.com",
            subject:"Reset star catering password",
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/user/setnewpassword/:' + token + '\n\n' +' please note that this link will only be available fo 15 minutes '+
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        let sendMail = await mailer.MailPasswordLink(mailOptions)
            return res.json("check your mail for password reset link")
            }else{
                return res.json("check your mail for password reset link")
            }

        })
    }
}

exports.setNewPassword = async(req,res)=>{
    let token = ""
    const {password} = req.body
    token = req.params.token
    let user = await Use.findOne({passwordResetToken:token})
    if(!user){
        return res.json("link has expired or user dosent exist")
    }
    user.password = password
    user.passwordResetToken =undefined
    user.passwordResetExpires =undefined
    await user.save()
    return res.json("password reset sucessful")
}

exports.contactUs =  async(req,res)=>{
const {name,email,phoneNumber,message} = req.body
if(name !== null || email !== null || phoneNumber !== null || message!== null){
    const contactUs = new Contact(req.body)
    await contactUs.save((err,user)=>{
        if(!err){
            return res.json({status:"message sent"})
        }else{
            console.log(err)
            return res.json({status:"message not sent"})
        }
    })
}
}

