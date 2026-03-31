const express = require('express');
const router = express.Router();
const orders = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Main order routes
router.get('/', orders.get_orders);           // Get all orders (admin: all, user: their own)
router.get('/:id', orders.get_order_by_id);   // Get single order by ID
router.post('/', orders.add_order);           // Create new order

// Additional order routes
router.put('/:id/status', orders.update_order_status);  // Update order status (admin only)
router.delete('/:id', orders.cancel_order);             // Cancel order (user only)
router.put('/:id/return', orders.return_rental_books);  // Return rental books

module.exports = router;