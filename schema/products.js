const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    productName: {
        type: 'String',
        required: [true, 'please provide a product']
    },
    price: {
        type: 'String',
        required: [true, 'please provide the product price']
    },
    productImage: {
        type: 'String',
        required: [true, 'please provide a product image']
    },
    numberOforders: {
        type: 'String',
        default: '0'
    },
    productDescription: {
        type: 'String',
        required: [true, 'please provide a product description']
    }
})

const products = mongoose.model('products', productsSchema)
module.exports = products