const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/users', userController.createUser);

router.get('/users/email/:email', userController.getUserByEmail);

router.get('/users/:userId', userController.getUserById);

router.post('/login', userController.loginUser);

module.exports = router;
