const express = require('express');
const router = express.Router();
const checkAuth =  require('../middleware/check-auth');
const checkAuthAdmin =  require('../middleware/check-auth-admin');
const RestaurantsController = require('../controllers/restaurants');

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


router.get('/',checkAuth,RestaurantsController.restaurants_get_all);

router.post('/',checkAuthAdmin,upload.single('restaurant_logo'),RestaurantsController.restaurants_post_restaurant);

router.patch('/:restaurantId',checkAuthAdmin,RestaurantsController.restaurants_patch_restaurant);

router.delete('/:restaurantId',checkAuthAdmin,RestaurantsController.restaurants_delete_restaurant);

module.exports = router;