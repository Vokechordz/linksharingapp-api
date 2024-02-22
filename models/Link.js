const mongoose= require('mongoose')
const AutoIncrement= require('mongoose-sequence')(mongoose)

const linkSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    selectValue: {
        type: String,
        required: true
    },
    textValue: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})




module.exports= mongoose.model('Link', linkSchema)