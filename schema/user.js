const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'please provide your name']
    },
    email: {
        type: String,
        required: [true, 'please provide your email']
    },
    address: {
        type: String,
        required: [true, 'please provide your address']
    },
    password: {
        type: String,
        required: [true, 'please provide a password']
    },
    profilepic: {
        type: String,
        default: '/profilepic/imagename',
    },
    date: {
        type: Date,
        default: Date.now()
    }

})

userSchema.pre('save', function(next) {
    const users = this
    bcryptjs.hash(users.password, 10, function(error, encrypted) {
        users.password = encrypted
        next()
    })
})

const User = mongoose.model('User', userSchema)
module.exports = User