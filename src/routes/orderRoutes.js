const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, listOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

router.get('/list', listOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrderById);
router.put('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);

module.exports = router;
