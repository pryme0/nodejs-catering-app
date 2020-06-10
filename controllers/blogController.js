const express = require('express')
const Users = require('../schema/user')
const Blog = require('../schema/blog')
const path = require('path')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const userController = require('../controllers/useController')
const Auth = require('../config/Auth')
const productController = require('../controllers/productsController')




//renders the creat post page
exports.createPostPage = async(req, res) => {
    if (!req.header.token) {
        res.redirect('/user/login')
    }
    else {
           userId = req.header.token
        res.render('createpost', {
            userId
        })
        }
     }

//method to create a blogpost
exports.createPost = async(req, res) => {
    const { title, content } = req.body
    const { image } = req.files
    let splited = image.name.split(".")
    let extension = splited[1]
    token = req.header.token
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    image.mv(path.resolve(__dirname, "../", "public/postimages", title + "." + extension), async() => {
       let newBlog= new Blog({...req.body, author: decode._id, image: `/postimages/${title}` + "." + extension })
          await newBlog.save()
          return res.json({status:"post created",post:newBlog}) 
        })
}

//method to get posts from the database
exports.getPost = async(req, res) => {
    let blog = await Blog.find({}).populate('author')
    return res.json(blog)
}

exports.renderBlog = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.render('blog')

}
exports.getSinglePost = async(req, res) => {
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    let blog = await Blog.findById(req.params.id).populate('author')
    return res.render('post', { blog ,userId})
}
exports.getUserPost = async(req,res)=>{
    const id = req.params.id
    let userPosts = await Blog.find({author:id}) 
    if(!userPosts){
        return res.json('No posts available')
    }else{
        return res.json(userPosts)
    }
}