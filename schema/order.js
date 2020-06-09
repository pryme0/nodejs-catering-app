const { model, Schema } = require('mongoose')
const jwt = require('jsonwebtoken')

const orderSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'provide orderer']
    },
    totalCost: {
        type: String,
        required: [true, 'provide total cost']
    },
    date: {
        type: Date,
        default: Date.now()
    },
    summary: {
        type: String,
        required: [true, 'provide summary']
    },
    orderToken: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    paymentStatus: {
        type: String,
        default: "Not Paid"
    }
})

orderSchema.methods.generateOrderToken = async function() {
    const orderToken = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.orderToken = orderToken;
    await this.save()
    return this
}

const Order = model('Order', orderSchema)
module.exports = Order