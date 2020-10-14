const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

const Schema = mongoose.Schema

const commentSchema = new Schema({
    topic_id: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    from_id: {
        type: String,
        required: true,
    },
    from_nickname: {
        type: String
    },
    like: {
        type: Number
    }
})


const Comment = module.exports = mongoose.model('Comment', commentSchema)