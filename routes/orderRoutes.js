import express from 'express';
import { 
    get_orders, 
    get_order_by_id, 
    add_order,
    update_order_status,
    cancel_order,
    return_rental_books
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Main order routes
router.get('/', get_orders);              // Get all orders (admin: all, user: their own)
router.get('/:id', get_order_by_id);      // Get single order by ID
router.post('/', add_order);              // Create new order

// Additional order routes
router.put('/:id/status', update_order_status);   // Update order status (admin only)
router.delete('/:id', cancel_order);              // Cancel order (user only)
router.put('/:id/return', return_rental_books);   // Return rental books

export default router;