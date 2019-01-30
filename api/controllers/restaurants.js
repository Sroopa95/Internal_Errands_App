const mongoose  = require('mongoose');
const Restaurant = require('../models/restaurant');

exports.restaurants_get_all = (req,res,next) => {
    Restaurant.find()
    .select('restaurant_name location restaurant_logo _id phone site_url opening_hours')
    .exec()
    .then(doc =>{
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                return {
                        restaurant_name: doc.restaurant_name,
                        location: doc.location,
                        restaurant_logo: doc.restaurant_logo,
                        opening_hours: doc.opening_hours,   
                        _id: doc._id,
                        phone: doc.phone,
                        email: doc.email,
                        site_url: doc.site_url,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/restaurants/' + doc.restaurant_name
                        }
                }
            })
        };
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        }); 
    });
}


exports.restaurants_post_restaurant = (req,res,next) => {
    console.log(req.file);
    const restaurant =  new Restaurant({
        _id: new mongoose.Types.ObjectId(),
        restaurant_name: req.body.restaurant_name,
        location: req.body.location,
        restaurant_logo: req.file.path,
        opening_hours: req.body.opening_hours,   
        phone: req.body.phone,
        email: req.body.email,
        site_url: req.body.site_url,
    });
    restaurant
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /restaurants',
            createdRestaurant: {
                _id: result._id,
                restaurant_name: result.restaurant_name,
                location: result.location,
                restaurant_logo: result.restaurant_logo,
                opening_hours: result.opening_hours,   
                phone: result.phone,
                email: result.email,
                site_url: result.site_url,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/restaurants/' + result._id
                }
            }
        });
    })
    .catch(err => 
        console.log(err));
        res.status(201).json({
            message: 'already existing email'
        });
    }


exports.restaurants_patch_restaurant = (req,res,next) =>{

    const id =  req.params.restaurantId;
    const updateOps = {}

    for( const ops  of req.body){
        updateOps[ops.propName] = ops.value
    }
    Restaurant.update({_id : id}, {$set: updateOps})
    .exec()
    .then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}


exports.restaurants_delete_restaurant = (req,res,next) =>{

    const id =  req.params.restaurantId;
    Restaurant.remove({_id : id})
    .exec()
    .then(doc =>{
        console.log(doc);
        if(doc.length >= 0){
            res.status(200).json(doc);
        }else{
            res.status(200).json({
                message: 'No entries found'
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        }); 
    });
}