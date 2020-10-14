const User = require('../models/user')
const express = require('express')
const {
    data
} = require('jquery')
const {
    route
} = require('../router')
const bodyParser = require('body-parser')
const fs = require('fs')
const formidable = require('formidable')
const md5 = require('blueimp-md5')
let cacheFolder = 'public/img/' //头像存放路径


const router = express.Router()


//设置信息  
router.get('/settings/profile', (req, res, next) => {
    let body = req.session.user

    User.findOne({
        email: body.email
    }, (err, quser) => {
        if (err) {
            return next(err)
        }
        res.render('./settings/profile.html', {
            user: quser
        })
    })


})

router.post('/settings/profile', (req, res) => {
    //1.获取表单数据
    //2.保存重新渲染页面
    let ibody = req.session.user
    let body = req.body
    ibody.nickname= body.nickname
    // console.log(body)
    User.findOneAndUpdate({
        email: body.email
    }, body, (err, data) => {
        if (err) {
            return next(err)
        }
        // console.log(ibody);
        res.status(200).json({
            err_code: 0,
            messagae: '修改信息成功'
        })
    })

})


router.get('/settings/admin', (req, res) => {
    let body = req.session.user

    User.findOne({
        email: body.email
    }, (err, quser) => {
        if (err) {
            return next(err)
        }
        res.render('./settings/admin.html', {
            user: quser
        })
    })
})

router.post('/settings/admin', (req, res, next) => {
    let suser = req.session.user //获取session.user 依据email进行查询
    let body = req.body //post表单的数据
    User.findOne({
        email: suser.email
    }, (err, user) => {
        if (err) {
            return next(err)
        }
        if (user.password != md5(body.opassword)) {
            return res.status(200).json({
                err_code: 1,
                messagae: 'opassword is mistake..'
            })
        }
        if (user.password == md5(body.npassword) || user.password == md5(body.cpassword)) {
            return res.status(200).json({
                err_code: 2,
                messagae: 'Cannot be the same as the old password'
            })
        }
        if (body.npassword != body.cpassword) {
            return res.status(200).json({
                err_code: -1,
                messagae: 'The two passwords do not match..'
            })
        }
    })
    User.findOneAndUpdate({
        email: suser.email
    }, {
        password: md5(body.npassword)
    }, (err, data) => {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            messagae: 'change is ok !'
        })
    })
})




router.get('/logoff', (req, res) => {
    let user = req.session.user
    User.deleteOne({
        email: user.email
    }, err => {
        if (err) {
            return next(err)
        }
        req.session.destroy()
        return res.redirect('/')
    })
})

module.exports = router