
const mongoose  = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req,res,next) => {
    const Order = require('../models/order'); 
        Order.find()
        .select('product quantity annotations _id')
        .exec()
        .then(doc =>{
            const response = {
                count: doc.length,
                products: doc.map(doc => {
                    return {
                            product: doc.product,
                            quantity: doc.quantity,
                            annotations: doc.annotations,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + doc._id
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

exports.orders_post_order = (req,res,next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        products: req.body.products,
        deliveryTime: new Date(req.body.deliveryTime),
        deliveryAt: req.body.deliveryAt,
        annotations: req.body.annotations
    });
    order.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored',
            createOrder: {
                _id: result._id,
            },
            request:{
                type: 'GET',
                url:  'htttp://localhost:3000/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });  
}

exports.orders_get_order = (req,res,next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'order not found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http:localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    });
}

exports.orders_delete_order = (req,res,next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'deleted',
            request: {
                type: 'POST',
                url: 'http:localhost:3000/orders',
                body: {productId: 'ID', quantity: 'Number'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    });
}


