const express =  require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const checkAuth =  require('../middleware/check-auth');
const Product = require('../models/product');

const multer = require('multer');
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage:storage});
router.get('/',(req,res,next) => {

    Product.find()
    .select('name price description _id productImage')
    .exec()
    .then(doc =>{
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
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
});
router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product =  new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        productImage:  req.file.path
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
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => 
        console.log(err));
    });
router.get('/:productId',(req,res,next) =>{
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

});

router.patch('/:productId',checkAuth,(req,res,next) =>{

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
});

router.delete('/:productId',checkAuth,(req,res,next) =>{

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
});


module.exports = router;