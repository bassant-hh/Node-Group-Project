import express from 'express';
const router = express.Router();
import users from '../controllers/userController.js';
import { isLogin } from '../middleware/authMiddleware.js';

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh-token', users.refresh_token);
router.post('/logout', users.logout);
router.patch('/update-info', users.update_info); 
router.patch('/update-progress',isLogin, users.update_reading_progress);
export default router;