const express = require('express')
const Users = require('../schema/user')
const bcrypt = require('bcryptjs')

const router = express.Router()
router.use(express.static('public'))
router.get('/home', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})
router.post('/login', (req, res) => {
    let { email, password } = req.body
    Users.findOne({ email: email }).then(user => {
        if (user) {
            bcrypt.compare(password, user.password).then(resp => {
                if (resp === true) {
                    req.session.userid = user._id
                    return res.json('match')
                } else if (resp === false) {
                    return res.json('Password do not match')
                }
            })
        } else {
            return res.json('User not found')
        }
    })
})

router.post('/register', (req, res) => {
    const { fullname, email, address, password } = req.body
    Users.findOne({ email: email }).then(user => {
        if (user) {

            return res.json('user already exits')
        } else {
            Users.create({ fullname, email, address, password }, (error, use) => {
                if (error) {
                    console.error('error  ' + error)
                    return res.json('Registration not successful')

                } else {
                    return res.json('Registration successful')
                }

            })

        }
    })
})


module.exports = router