const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose  = require('mongoose');

exports.users_post_user = (req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'auth failed no user'
            });
        }else{
            bcrypt.compare(req.body.password, user[0].password,(err,result) => {
                if(err){
                    return res.status(401).json({
                        message: 'auth failed, bcrypt did not work'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                            admin: user[0].admin
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }  
                    );
                    return res.status(200).json({
                        message: 'auth succesful',
                        token: token
                    });
                }else{
                    return res.status(401).json({
                        message: 'auth failed'
                    });
                }
            })
        }
    } )
    .catch(err => {
        console.log('Error')
        res.status(500).json({
            error: err
        });
    });
}


exports.users_signup_user = (req,res,next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(422).json({
                message: 'Email already exists'
            });
        }else{
 
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user =  new User({
                        admin: false,
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    }).catch(err => {
                        console.log('Error')
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
}

exports.users_delete_user = (req,res,next)=>{
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'deleted'
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}