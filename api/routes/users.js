const express =  require('express');
const router = express.Router();
const mongoose  = require('mongoose');
const checkAuthAdmin =  require('../middleware/check-auth-admin');
const UsersController = require('../controllers/users');

router.post('/login',UsersController.users_post_user);
router.post('/signup',UsersController.users_signup_user);
router.delete('/:userId',checkAuthAdmin,UsersController.users_delete_user);

module.exports = router;