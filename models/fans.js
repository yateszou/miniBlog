const mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

const Schema = mongoose.Schema

const fansSchema = new Schema({
    user_id: {
        type: String
    },
    fan_id: {
        type: String
    }
})


const Fan = module.exports = mongoose.model('Fan', fansSchema)