const express = require('express')
const Users = require('../schema/user')

const router = express.Router()
router.use(express.static('public'))
router.get('/home', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {

    res.render('register')
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