const Order = require('../models/Order');

/**
 * Faz o mapping dos campos do body (formato PT-BR) para o formato
 * que será salvo no banco de dados (formato EN).
 *
 * Mapeamento:
 *   numeroPedido       -> orderId
 *   valorTotal         -> value
 *   dataCriacao        -> creationDate
 *   items[].idItem         -> items[].productId
 *   items[].quantidadeItem -> items[].quantity
 *   items[].valorItem      -> items[].price
 */
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

/**
 * POST /order
 * Cria um novo pedido no banco de dados.
 * Valida os campos obrigatórios, verifica duplicidade e aplica o mapping.
 */
const createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Valida presença dos campos obrigatórios
    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items)
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: numeroPedido, valorTotal, dataCriacao, items' });

    // Valida que items é um array não vazio
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'O campo items deve ser um array não vazio' });

    // Verifica se já existe um pedido com o mesmo numeroPedido
    const existing = await Order.findOne({ orderId: numeroPedido });
    if (existing)
      return res.status(409).json({ error: `Pedido '${numeroPedido}' já existe` });

    // Aplica o mapping e salva no banco
    const order = await Order.create(mapRequestToOrder(req.body));
    return res.status(201).json({ message: 'Pedido criado com sucesso', order });
  } catch (error) {
    // Trata erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Erro de validação', details: messages });
    }
    console.error('Erro em createOrder:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * GET /order/:orderId
 * Busca um pedido pelo número (orderId) passado como parâmetro na URL.
 * Retorna 404 se o pedido não for encontrado.
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order)
      return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });
    return res.status(200).json(order);
  } catch (error) {
    console.error('Erro em getOrderById:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * GET /order/list
 * Retorna todos os pedidos cadastrados, ordenados por data de criação (mais recente primeiro).
 */
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ creationDate: -1 });
    return res.status(200).json({ total: orders.length, orders });
  } catch (error) {
    console.error('Erro em listOrders:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * PUT /order/:orderId
 * Atualiza os dados de um pedido existente pelo número (orderId).
 * Aceita o body tanto no formato PT-BR (com mapping) quanto em EN (direto).
 * Retorna 404 se o pedido não for encontrado.
 */
const updateOrder = async (req, res) => {
  try {
    // Se o body vier em PT-BR, aplica o mapping; caso contrário usa direto
    const updateData = req.body.numeroPedido ? mapRequestToOrder(req.body) : req.body;

    // Impede alteração do orderId via update
    delete updateData.orderId;

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: updateData },
      { new: true, runValidators: true } // Retorna o documento atualizado e valida
    );

    if (!order)
      return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });

    return res.status(200).json({ message: 'Pedido atualizado com sucesso', order });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Erro de validação', details: messages });
    }
    console.error('Erro em updateOrder:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * DELETE /order/:orderId
 * Remove um pedido pelo número (orderId) passado como parâmetro na URL.
 * Retorna 404 se o pedido não for encontrado.
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
    if (!order)
      return res.status(404).json({ error: `Pedido '${req.params.orderId}' não encontrado` });
    return res.status(200).json({ message: `Pedido '${req.params.orderId}' deletado com sucesso` });
  } catch (error) {
    console.error('Erro em deleteOrder:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { createOrder, getOrderById, listOrders, updateOrder, deleteOrder };
