const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

/**
 * Rotas da API de pedidos.
 *
 * IMPORTANTE: A rota /list deve ser declarada ANTES de /:orderId
 * para não ser interpretada como um parâmetro dinâmico.
 */

// GET  /order/list          → Lista todos os pedidos
router.get('/list', listOrders);

// POST /order               → Cria um novo pedido
router.post('/', createOrder);

// GET  /order/:orderId      → Busca pedido pelo número
router.get('/:orderId', getOrderById);

// PUT  /order/:orderId      → Atualiza pedido pelo número
router.put('/:orderId', updateOrder);

// DELETE /order/:orderId    → Deleta pedido pelo número
router.delete('/:orderId', deleteOrder);

module.exports = router;
