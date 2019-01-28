exports.orders_get_all =(req,res,next) => {
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