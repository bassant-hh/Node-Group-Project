import express from 'express';
import {isLogin} from '../middleware/authMiddleware.js';
const router = express.Router();
import users from '../controllers/userController.js';
import { is } from 'express/lib/request.js';

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh-token', isLogin, users.refresh_token);
router.post('/logout', isLogin, users.logout);
router.patch('/update-info', isLogin, users.update_info); 

export default router;