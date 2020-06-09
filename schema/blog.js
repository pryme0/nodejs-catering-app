const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

    title: {
        type: 'String',
        required: ['true', 'please provide a title']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: 'String',
        required: ['true', 'please provide an image']
    },
    content: {
        type: 'String',
        required: ['true', 'please provide post content']
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const blog = mongoose.model('blog', blogSchema)
module.exports = blog