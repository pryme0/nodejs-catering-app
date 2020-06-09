const express = require('express')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const path = require('path')
const connectMongo = require('connect-mongo')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const userController = require('./controllers/useController')
const cors = require('cors')



const app = express()
dotenv.config({
        path: '.env'
    })
    //connecting to your database
require('./config/db')

const port = process.env.port || 4000
/*const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'secrt',
    resave: true,
    saveUninitialized: true
}))*/

app.use(cors())
app.use(fileUpload())
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.set('views', `${__dirname}/views`)
app.use(express.static(__dirname + "/public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//setting headers
app.use(function(req, res, next) {
    let userId
    if (!req.header.token) {
        userId = null
    } else {
        userId = req.header.token
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Authorization',userId );
    req.headers.Authorization =userId

        next();
  });
//import user routes
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)
    //homepage route
app.get('/', userController.renderIndex)

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'Fail',
        message: `Could not find ${req.originalUrl} on the Server!`
    });
});

app.listen(port, () => {
    console.log('sever started on port 3000')
})