// import express from 'express';
// import {isLogin} from '../middleware/authMiddleware.js';
// const router = express.Router();
// import { protect } from '../middleware/authMiddleware.js';
// import { 
//   registerUser, 
//   loginUser, 
//   getUserProfile 
// } from '../controllers/userController.js';

// import users from '../controllers/userController.js';
// // import { is } from 'express/lib/request.js';

// router.post('/register', users.register);
// router.post('/login', users.login);
// router.post('/refresh-token', isLogin, users.refresh_token);
// router.post('/logout', isLogin, users.logout);
// router.patch('/update-info', isLogin, users.update_info); 

// export default router;


import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  registerUser, 
  loginUser, 
  getUserProfile 
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes  
router.get('/profile', protect, getUserProfile);

export default router;