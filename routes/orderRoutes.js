const express = require('express');
const router = express.Router();
const orders = require('../controllers/orderController');

router.get('/', orders.get_orders);
router.get('/:id', orders.get_order_by_id);
router.post('/', orders.add_order);

module.exports = router;