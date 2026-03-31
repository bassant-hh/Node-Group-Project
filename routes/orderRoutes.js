import express from 'express';
const router = express.Router();
import orders from '../controllers/orderController.js';

router.get('/', orders.get_orders);
router.get('/:id', orders.get_order_by_id);
router.post('/', orders.add_order);

export default router;