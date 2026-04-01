import express from 'express';
const router = express.Router();

import { 
    get_orders, 
    get_order_by_id, 
    add_order,
    update_order_status,
    cancel_order,
    return_rental_books
} from '../controllers/orderController.js';
import { isLogin } from '../middleware/authMiddleware.js';
import { errorMiddleware } from '../middleware/errorMiddleware.js';

// Apply authentication middleware to all routes
router.use(isLogin);

// Main order routes
router.get('/', errorMiddleware,get_orders,errorMiddleware);              // Get all orders (admin: all, user: their own)
router.get('/:id', errorMiddleware,get_order_by_id,errorMiddleware);      // Get single order by ID
router.post('/', errorMiddleware,add_order,errorMiddleware);              // Create new order

// Additional order routes
router.put('/:id/status', errorMiddleware,update_order_status,errorMiddleware);   // Update order status (admin only)
router.delete('/:id', errorMiddleware,cancel_order,errorMiddleware);              // Cancel order (user only)
router.put('/:id/return', errorMiddleware,return_rental_books,errorMiddleware);   // Return rental books

export default router;