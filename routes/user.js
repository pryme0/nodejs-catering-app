const express = require('express')
const Users = require('../schema/user')
const Products = require('../schema/products')
const Blog = require('../schema/blog')
const bodyParser = require('body-parser')
const path = require('path')
const bcrypt = require('bcryptjs')
const userController = require('../controllers/useController')
const Auth = require('../config/Auth')
const productController = require('../controllers/productsController')
const blogController = require('../controllers/blogController')
const paymentController = require('../controllers/paymentController')
const orderController = require('../controllers/orderController')



const router = express.Router()
router.use(express.static(path.resolve(__dirname, "../", "public")))
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


//defining user routes
router.get('/register',userController.renderRegister)
router.get('/checkout', userController.renderCheckout )
router.get('/login',userController.renderLogin )
router.get('/dashboard', Auth,userController.renderDashboard)
router.get('/admin',Auth,userController.renderAdmin)
router.post('/productupload', productController.registerProducts)
router.get('/getproducts', productController.getAllproducts)
router.post('/login', userController.LoginUser)
router.get('/logout', userController.logoutUser)
router.post('/register', userController.createUser)
router.get('/blog', blogController.renderBlog)
router.get('/createpost',Auth, blogController.createPostPage)
router.post('/createpost',Auth, blogController.createPost)
router.get('/getposts', blogController.getPost)
router.get('/singlepost/:id', blogController.getSinglePost)
router.get('/getspecificproduct/:id', productController.getSingleProduct)
router.post('/productupdate/:id',Auth, productController.productUpdate)
router.get('/deleteproduct/:id', Auth, productController.deleteProduct)
router.get('/deleteuser/:id', Auth, userController.deleteUser)
router.post('/order', Auth, orderController.order)
//router.post('/resetpassword', userController.resetPassword)
router.get('/getorders', orderController.getOrders)
router.get('/payment', paymentController.renderProcessPayment)
router.get('/payment/:id', paymentController.renderPaymentStatus)
router.post('/verifypayment', paymentController.verifyPayment)
router.get('/getuserorder/:id', orderController.getUserOrder)
router.post('/uploadprofilepic/:id', userController.uploadPic)
router.get('/getuserposts/:id', blogController.getUserPost)
//router.get('/getlogstat',userController.getStatus)
router.get('/contact',userController.renderContact)
router.get('/resetpassword',userController.renderPasswordReset)
router.post('/sendPasswordResetMail',userController.sendPasswordResetMail)
router.get('/setnewpassword/:token',userController.renderSetNewPassword)
router.post('/setnewpassword/:token',userController.setNewPassword)
router.get('/sucessfulpayment/:id',userController.renderSucessfulPayment)
router.post('/contact',userController.contactUs)

















module.exports = router