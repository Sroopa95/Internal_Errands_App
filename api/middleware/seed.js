const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const UsersController = require('../controllers/users');
const bcrypt = require('bcrypt');

Order.collection.deleteMany({},(err,orders) => {
    if(!err){
        console.log('deleted all orders' + orders);
    }
});

Product.collection.deleteMany({},(err,products)=>{
    if(!err){
        console.log('deleted all products' + products);
    }
});

User.collection.deleteMany({},(err,users)=>{
    if(!err){
        console.log('deleted all users' + users);
    }
});


User.find({email: "carlosperezaraujo@outlook.com"})
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(422).json({
                message: 'Email already exists'
            });
        }else{
 
            bcrypt.hash("carlosadmin",10,(err,hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user =  new User({
                        admin: true,
                        _id: new mongoose.Types.ObjectId(),
                        email: "carlosperezaraujo@outlook.com",
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

