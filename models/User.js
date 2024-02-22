const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    profilepic: {
        type: String,
        required: false
    }
})


module.exports= mongoose.model('User', userSchema)