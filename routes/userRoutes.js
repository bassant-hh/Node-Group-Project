import express from 'express';
import {isLogin,isOwner} from '../middleware/authMiddleware.js';
const router = express.Router();
import {register,login,refresh_token,logout,update_info,update_reading_progress} from '../controllers/userController.js';

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refresh_token);
router.post('/logout', isLogin, logout);
router.put('/update-info', isLogin,isOwner, update_info); 
router.put('/update-progress', isLogin, update_reading_progress);

export default router;