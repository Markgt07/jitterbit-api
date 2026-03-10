const Order = require('../models/Order');

const mapRequestToOrder = (body) => ({
  orderId:      body.numeroPedido,
  value:        body.valorTotal,
  creationDate: new Date(body.dataCriacao),
  items: (body.items || []).map((item) => ({
    productId: Number(item.idItem),
    quantity:  item.quantidadeItem,
    price:     item.valorItem,
  })),
});

const createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items)
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: numeroPedido, valorTotal, dataCriacao, items' });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'O campo items deve ser um array não vazio' });
    const existing = await Order.findOne({ orderId: numeroPedido });
    if (existing)
      return res.status(409).json({ error: `Pedido '${numeroPedido}' já existe` });
    const order = await Order.create(mapRequestToOrder(req.body));
    return res.status(201).json({ message: 'Pedido criado com sucesso', order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Erro de validação', details: messages });
    }
    console.error('Erro em createOrder:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });
    return res.status(200).json({ total: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const updateData = req.body.numeroPedido ? mapRequestToOrder(req.body) : req.body;
    delete updateData.orderId;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });
    return res.status(200).json({ message: 'Pedido atualizado com sucesso', order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Erro de validação', details: messages });
    }
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });
    return res.status(200).json({ message: `Pedido '${req.params.orderId}' deletado com sucesso` });
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { createOrder, getOrderById, listOrders, updateOrder, deleteOrder };
