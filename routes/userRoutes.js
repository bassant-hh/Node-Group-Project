const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh-token', users.refresh_token);
router.post('/logout', users.logout);
router.patch('/update-info', users.update_info); 

module.exports = router;