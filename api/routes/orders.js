const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose  = require('mongoose');
const Product = require('../models/product');
const checkAuth =  require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');
router.get('/',checkAuth,OrdersController.orders_get_all);

router.post('/',checkAuth,(req,res,next) => {

    console.log(Product.findById(req.body.product));
    Product.findById(req.body.product)
        .then(product => {
            if(!product){
                return res.status(400).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.product,
                annotations: req.body.annotations
            });
            console.log('Product found')
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    annotations: result.annotations,
                    quantity: result.quantity
                },
                request:{
                    type: 'GET',
                    url: 'htttp://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });  
});

router.get('/:orderId',checkAuth,(req,res,next) => {
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
});

router.delete('/:orderId',checkAuth,(req,res,next) => {
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
});


module.exports = router;