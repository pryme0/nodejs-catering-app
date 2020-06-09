const jwt = require('jsonwebtoken')
const User = require('../schema/user')
const Order = require('../schema/order')
const Products = require('../schema/products')
const bodyParser = require('body-parser')
const express = require('express')


router = express()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))



exports.getOrders=async (req,res)=>{
    try{
     let orders = await Order.find({}).populate('author')
    if(!orders){
        return res.json("No records found")
    }
    return res.status(200).json(orders)
    }
    catch(error){
        console.log(error)
        return res.status(400).json("failed")
    }
  
  
}

exports.order = async function(req, res) {
    try{
        if(req.body == null){
            return res.json("invalid order request")
        }
        const token = JSON.parse(req.body.author.replace('Bearer', ''))
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        author = decode._id
        let orderArray = JSON.parse(req.body.order)
        let summary= ""
        orderArray.forEach(order=>{
            summary += order.quantity + " "+ order.name + " , "
        })         
       const { deliveryAddress, phoneNumber, state, totalCost } = req.body
        const testOder = new Order({summary,author, deliveryAddress, phoneNumber, state, totalCost})
        const newOrder = await testOder.generateOrderToken()        
    return res.status(200).json({'order':newOrder,
    'status':"success"})
    }catch(error){
console.log(error)
    }
       
}

exports.getUserOrder = async(req,res)=>{
    console.log("hello")
    console.log(req.params.id)
    let userOrders = await Order.find({author:req.params.id}).populate('author')
    if(!userOrders){
        return res.json({"status":"No records found"})
    }else{
        return res.json({userOrders})
    }
}

