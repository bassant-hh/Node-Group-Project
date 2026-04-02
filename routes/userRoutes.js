import express from 'express';
import {isLogin,isOwner} from '../middleware/authMiddleware.js';
const router = express.Router();
import users from '../controllers/userController.js';

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh-token', users.refresh_token);
router.post('/logout', isLogin, users.logout);
router.patch('/update-info', isLogin,isOwner, users.update_info); 

export default router;