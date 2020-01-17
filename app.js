const express = require('express')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const connectMongo = require('connect-mongo')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const homepageController = require('./controllers/homepagecontroller')


const app = express()
const port = process.env.port || 3000
mongoose.connect('mongodb://localhost:27017/carter', { useNewUrlParser: true })
const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'secrt',
    resave: true,
    saveUninitialized: true
}))

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.set('views', `${__dirname}/views`)
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())



//import user routes
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)
    //homepage route
app.get('/', homepageController)

app.listen(port, () => {
    console.log('sever started on port 3000')
})