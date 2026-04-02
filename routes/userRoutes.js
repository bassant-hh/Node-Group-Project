import express from 'express';
import {isLogin,isOwner} from '../middleware/authMiddleware.js';
const router = express.Router();
import {register,login,refresh_token,logout,update_info} from '../controllers/userController.js';

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refresh_token);
router.get('/logout', isLogin, logout);
router.put('/update-info', isLogin,isOwner, update_info); 

export default router;