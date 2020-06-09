const { model, Schema } = require('mongoose')
const jwt = require('jsonwebtoken')

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'provide name']
    },
  
    date: {
        type: Date,
        default: Date.now()
    },
    phoneNumber: {
        type: String,
        required: [true, 'provide phoneNumber']
    },
    email: {
        type: String,
        required: [true, 'provide email']
    },
    message: {
        type: String,
        required: [true, 'provide message']
    }
})



const contact = model('contact', contactSchema)
module.exports = contact