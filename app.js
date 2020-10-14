
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./router')
const profile = require('./routes/profile')
const topic = require('./routes/topic')

const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

// 配置解析表单 post 请求数据
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'yates', // 配置加密字符串，类似于 md5 的拼接加密
    resave: false,
    saveUninitialized: false // 无论是否使用 session 默认为 true 分配一把钥匙key
}))

// 把路由挂载在 app 中
app.use(router)
app.use(profile)
app.use(topic)

// 配置一个处理 404 的中间件
app.use((req, res) => {
    res.render('404.html')
})
// 配置一个全局错误处理中间件
app.use((err, req, res, next) => {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.listen(3000, () => {
    console.log('running...')
})