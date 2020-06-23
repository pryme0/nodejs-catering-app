const express = require('express')
const Use = require('../schema/user')
const Products = require('../schema/products')
const Blog = require('../schema/blog')
let multer = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs')


exports.productUpdate = async(req, res) => {
    let id = req.params.id
    id = id.substr(1)
    const { productImage } = req.files
    const { productName, productDescription, price } = req.body
    let splited = productImage.name.split(".")
    let extension = "." + splited[1]
    let pro = await Products.findById(id)
    let fullname = productName + extension
    if (pro) {
        productImage.mv(path.resolve(__dirname, '..', 'public/products', fullname), (error) => {
            pro.updateOne({
                ...req.body,
                productImage: `products/${fullname}`
            }, async(error, post) => {
                if (error) {
                    console.log(error)
                    return res.json(error)
                } else {
                    let newpro = await Products.findById(id)
                    return res.json(newpro)
                }

            })

        })
    } else {
        return res.json('update failed try again')
    }


}

exports.deleteProduct = async(req, res) => {
    let id = req.params.id
    id = id.substr(1)
    const del = await Products.findById(id).deleteOne()
    if (del) {
        const newpro = await Products.find({})
        return res.json({ newpro, sucess: 'success' })
    } else {
        return res.json('failed')
    }

}

exports.getSingleProduct = async(req, res) => {
    let id = req.params.id.substring(1)
    let products = await Products.findById(id)
    return res.json(products)
}

exports.registerProducts = async(req, res) => {
    const { productImage } = req.files
    const { productName, productDescription, price } = req.body
    let splited = productImage.name.split(".")
    let extension = "." + splited[1]
    let fullname = productName + extension
    Products.find({ productName: productName })
        .then(produ => {
            if (!produ) {
                return res.json('Product already added')
            } else {
                productImage.mv(path.resolve(__dirname, '../public/products', fullname), (error) => {
                    Products.create({
                        ...req.body,
                        productImage: `products/${fullname}`
                    }, (error, post) => {
                        if (error) {
                            return res.json(error)
                        } else {
                            return res.json('product added sucessfully')
                        }
                    })

                })

            }
        })
}

exports.getAllproducts = async(req, res) => {
    let prod = await Products.find({})
    return res.json(prod)
}