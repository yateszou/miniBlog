const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
})

const Schema = mongoose.Schema

const plateSchema = new Schema({
    platename: {
        type: String,
        require: true
    }
})

const plateModel = module.exports = mongoose.model('Plate', plateSchema)


//用于初始数据模型和添加数据
const plates = ['分享', '问答', '招聘', '客户端测试']
// const iplates = new Array()
// for (let i = 0; i < plates.length; i++) {
//     let plate = new plateModel({
//         platename: plates[i]
//     })
//     iplates.push(plate)
// }
plateModel.insertMany(plates, err => {
    if (err) {
        console.log(err)
    }
    console.log('初始化成功....')
})