const express = require('express');
const router = express.Router();
const checkAuth =  require('../middleware/check-auth');
const checkAuthAdmin =  require('../middleware/check-auth-admin');
const OrdersController = require('../controllers/orders');

router.get('/',checkAuthAdmin,OrdersController.orders_get_all);

router.post('/',checkAuth,OrdersController.orders_post_order);

router.get('/:orderId',checkAuth,OrdersController.orders_get_order);

router.delete('/:orderId',checkAuthAdmin,OrdersController.orders_delete_order);


module.exports = router;