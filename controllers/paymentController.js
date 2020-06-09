const { model, Schema } = require('mongoose')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const request = require('request')
const paystack = require("paystack")(process.env.PAYSTACK_SECETKEY)
const Order = require("../schema/order")


exports.renderProcessPayment=async (req,res)=>{
   let userId =  req.header.token
   if (!req.header.token) {
    res.redirect('/user/login')
}
else {
       userId = req.header.token
       res.render('pay',{userId})

    }
  
}


exports.renderPaymentStatus=async (req,res)=>{
    let userId =  req.header.token
   res.render('pay',{userId})
   
 }
 exports.verifyPayment = async (req,res)=>{
const reference = req.body.reference
paystack.transaction.verify(reference, async function(error, body) {
    console.log(body)
if(body.message ==="Verification successful"){
    try{
   let splitRef= reference.split("_")
   orderId = splitRef[1]
   console.log(orderId)
   let order = await Order.findById(orderId)
   updatedOrder = await order.updateOne({paymentStatus:"paid"})
   if(updatedOrder){
    return res.json({status:"payment verified",id:orderId})
   }
    }catch(error){
console.log(error)
return res.json(error)
}
}else{
    return res.json({status:"payment failed"})}
})

}