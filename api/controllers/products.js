const mongoose  = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req,res,next) => {
    console.log(req.body.restaurant);
    Product.find({"restaurant": req.params.restaurant})
    .select('name price description _id productImage restaurant')
    .exec()
    .then(doc =>{
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        restaurant: doc.restaurant,   
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
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
exports.products_post_product = (req,res,next) => {
    console.log(req.file);
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImage:  req.file.path,
        restaurant: req.body.restaurant
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                productImage: result.productImage,
                restaurant: result.restaurant,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => 
        console.log(err));
    }



exports.products_get_product = (req,res,next) =>{
    const id =  req.params.productId;
    Product.findById(id)
    .select('name price description _id productImage')
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


exports.products_patch_product = (req,res,next) =>{

    const id =  req.params.productId;
    const updateOps = {}

    for( const ops  of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id : id}, {$set: updateOps})
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


exports.products_delete_product = (req,res,next) =>{

    const id =  req.params.productId;
    Product.remove({_id : id})
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