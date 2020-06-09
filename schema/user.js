const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'please provide your name']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'please provide your email']
    },
    address: {
        type: String,
        required: [true, 'please provide your address']
    },
    isAdmin: {
        type: Boolean,
        required: [true, 'please provide status']
    },
    password: {
        type: String,
        required: [true, 'please provide a password']
    },
    profilepic: {
        type: String,
        default: '/profilepic/',
    },
    tokens: [{
        token: {
            type: String,
            reuired: true
        }
    }],
    date: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpires: Date


})

// User's private data hidding on a fly before sending as a response
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.tokens;
    delete userObject.__v;
    return userObject;
};

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))return next();
    bcrypt.hash(this.password, 8,(err,hash)=>{
             if(err)return next(err)
            this.password = hash
            next()
        });
});


userSchema.methods.generateToken = async function() {
    const token = await jwt.sign({ _id: this._id.toString() },
        process.env.JWT_SECRET, { expiresIn: '2 days' }
    );
    newtokens = this.tokens.concat({ token });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

// Models methods for login credentials
userSchema.statics.findByLoginCredentials = async function(email, password) {
    const user = await this.findOne({ 'email': email });
    if (!user) {
        return "User not found"
    } else {
        let sharp = bcrypt.compare(password, user.password).then((resp) => {
            if (resp === false) {
                return { status: "failed" }
            } else {
                let match = user
                return user
            }
        });
        if (sharp.status != "failed") {
            return sharp
        } else {
            return sharp
        }

    }

};




const User = mongoose.model('User', userSchema)
module.exports = User