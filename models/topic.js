const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

const Schema = mongoose.Schema

const topicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    palte: {
        type: String
    },
    publisher_id: {
        type: String
    },
    publisher: {
        type: String
    },
    createtime: {
        type: String
    },
    readNum: {
        type: Number,
        default: 0
    },
    like: {
        type: Number
    },
    dislike: {
        type: Number
    }

})


module.exports = mongoose.model('Topic', topicSchema)


// let content = new Topic({
//     title: '测试文章标题',
//     content: '测试文章内容',
//     palte: '分享',
//     publisher:'yates_zou@163.com'
// })
// content.save().then(() => {
//     console.log('初始化成功。。。')
// })