const express =  require('express');
const router = express.Router();
const checkAuthAdmin =  require('../middleware/check-auth-admin');
const checkAuth =  require('../middleware/check-auth');
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

const ProductsController = require('../controllers/products');

router.get('/',checkAuth,ProductsController.products_get_all);

router.post('/',checkAuthAdmin,upload.single('productImage'),ProductsController.products_post_product);

router.get('/:productId',checkAuth,ProductsController.products_get_product);

router.patch('/:productId',checkAuthAdmin,ProductsController.products_patch_product);

router.delete('/:productId',checkAuthAdmin,ProductsController.products_delete_product);

module.exports = router;