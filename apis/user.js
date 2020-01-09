const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(data => {
        if (data.length >= 1) {
            return res.status(409).json(
                {
                    message: "email already exist"
                }
            )
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: req.body.password
            });
            user.save().then(result => {
                res.status(201).json({
                    message: 'User Registered!!'
                })
            })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
        }
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });

});

router.get('/', (req, res, next) => {
    User.find().exec().then(data => {
        res.status(200).json({
            data: data
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});


router.get('/:email', (req, res, next) => {
    User.find({ email: req.params.email }).exec().then(data => {
        res.status(200).json({
            data
        })
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

router.post('/login', (req, res, next) => {
    User.find({email : req.body.email}).exec()
    .then(data =>{
        if(data.length < 1){
            return res.status(200).json({
                message : 'auth failed'
            });
        }
        if(req.body.password === data[0].password){
            const token = jwt.sign({
                email: data[0].email,
                userId: data[0].id
            }, process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            });
            return res.status(200).json({
                message : 'Auth success',
                token
            });
        }else{
            return res.status(200).json({
                message : 'Auth failed'
            });
        }
    })
    .catch(data =>{
        res.status(500).json({
            error : data
        });
    });
});
module.exports = router;

