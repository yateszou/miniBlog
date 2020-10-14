
const express = require('express')
const User = require('./models/user')
const md5 = require('blueimp-md5')
const session = require('express-session')
const Topic = require('./models/topic')
const { parseJSON } = require('jquery')
const moment = require('moment')

const router = express.Router()

router.get('/', (req, res, next) => {
    // console.log(req.session.user)
    Topic.find( (err, topics) => {
        if (err) {
            return next(err)
        }

        // topics.createtime = moment(topics.createtime).format('YYYY-MM-DD HH:mm:ss')

        res.render('index.html', {
            user: req.session.user,
            topics: topics
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', (req, res, next) => {
    const body = req.body
    User.findOne({
        email: body.email,
        // password: md5(md5(body.password))
        password: md5(body.password)
    }, (err, user) => {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: err.message
            // })
            return next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        // 用户存在，登录成功，通过 session 记录登录状态
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/register', (req, res, next) => {
    res.render('register.html')
})

router.post('/register', (req, res, next) => {
    const body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, (err, data) => {
        if(err) {
            // return res.status(500).json({
            //     success: false,
            //     message: '服务端错误'
            // })
            return next(err)
        }
        if(data) {
            // 邮箱或昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname already exists.'
            })
        }

        // body.password = md5(md5(body.password))
        body.password = md5(body.password)
        new User(body).save((err, user) => {
            if(err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal error.'
                // })
                return next(err)
            }

            req.session.user = user

            // express 提供的方法 json 接受一个对象为参数转成字符串
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })

        
    })
})

router.get('/logout', (req, res) => {
    // 清除登录状态，重定向到登录页
    req.session.user = null
    res.redirect('/login')
})

module.exports = router