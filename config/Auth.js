const jwt = require('jsonwebtoken')
const User = require('../schema/user')

const auth = async(req, res, next) => {
    req.session.redirectTo = req.originalUrl
    if (req.session.redirectTo === "/user/processpayment/") {
        req.session.redirectTo = "/user/checkout/"
    }
    try {
        const token = req.headers.Authorization.replace('Bearer', '')
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const checkuser = await User.findOne({ _id: decode._id, 'tokens.token': token })
        if (!checkuser) {
            console.log('user not found')
            throw new Error()
        } else {
            req.token = token
            next()
        }

    } catch (error) {
        return res.status(401).json({
            status: 'failed',
            message: 'please Authenticate',
            error
        })

    }

}

module.exports = auth