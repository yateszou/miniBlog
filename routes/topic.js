// 新建话题、删除话题、修改话题、查看话题列表。。。。
const Topic = require('../models/topic')
const User = require('../models/user')
const Comment = require('../models/comment')
const Plate = require('../models/plate_select')
const Fan = require('../models/fans')
const express = require('express')
const url = require('url')
const {
    data
} = require('jquery')
const {
    response,
    query
} = require('express')
const {
    dirname
} = require('path')
const user = require('../models/user')
const fans = require('../models/fans')


const router = express.Router()


router.get('/topic/new', (req, res, next) => {

    let body = req.session.user

    User.findOne({
        email: body.email
    }, (err, quser) => {
        if (err) {
            return next(err)
        }
        Plate.find( (err, plates) => {
            if (err) {
                return next(err)
            }
            res.render('./topic/new.html', {
                user: quser,
                plates: plates
            })
        })

    })

})


router.post('/topic/new', (req, res, next) => {
    let body = req.body
    // console.log(body);
    let ncontent = new Topic(body)
    ncontent.save( err => {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'save is ok'
        })

    })
})


router.get('/topic/show', (req, res, next) => {

    if (req.session.user) {
        Topic.findById(req.query.id, (err, topic) => {
            if (err) {
                return next(err)
            }
            topic.readNum += 1
            Topic.updateOne({
                _id: req.query.id
            }, {
                readNum: topic.readNum
            }, (err, message) => {
                if (err) {
                    return next(err)
                }
            })
            User.findById(req.query.p_id, (err, user, next) => {
                if (err) {
                    return next(err)
                }

                Comment.find({
                    topic_id: req.query.id
                }, (err, comments) => {
                    if (err) {
                        return next(err)
                    }

                    // console.log(req.session.user)
                    res.render('./topic/show.html', {
                        topic: topic,
                        user: req.session.user,
                        quser: user,
                        comments: comments
                    })
                })

            })

        })
    } else {

        res.redirect('/login')
    }
})




router.post('/comment', (req, res, next) => {

    let ncomment = new Comment(req.body)
    ncomment.save( err => {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'save comment is ok!'
        })
    })
})



router.get('/getfan', (req, res, next) => {
    // query = req.query
    // console.log(req.query)
    // console.log(req.session.user._id)
    Fan.findOne({
        fan_id: req.session.user._id
    }, (err, fan) => {
        if (err) {
            return next(err)
        }
        
        if (!fan) {
            User.findById(req.query.user_id, (err, user) => {
                if (err) {
                    return next(err)
                }
                user.fans += 1
                User.updateOne({
                    _id: req.query.user_id
                }, {
                    fans: user.fans
                }, (err, message) => {
                    if (err) {
                        return next(err)
                    }
                })
                let nfan = new Fan(req.query)
                nfan.save(req.query, (err, message) => {
                    if (err) {
                        return next(err)
                    }
                })
                res.status(200).json({
                    err_code: 0,
                    message: 'fan is success'
                })
            })
        } else {
            res.status(200).json({
                err_code: 1,
                message: 'Has been focused on'
            })
        }
    })

})

module.exports = router