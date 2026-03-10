const mongoose = require('mongoose');

/**
 * Schema dos itens do pedido.
 * Representa cada produto dentro de um pedido.
 */
const itemSchema = new mongoose.Schema({
  // ID do produto (mapeado de idItem)
  productId: { type: Number, required: [true, 'productId é obrigatório'] },
  // Quantidade do item (mapeado de quantidadeItem)
  quantity:  { type: Number, required: [true, 'quantity é obrigatório'], min: [1, 'quantity deve ser no mínimo 1'] },
  // Preço unitário do item (mapeado de valorItem)
  price:     { type: Number, required: [true, 'price é obrigatório'], min: [0, 'price não pode ser negativo'] },
});

/**
 * Schema principal do pedido.
 * Os campos recebidos em PT-BR são mapeados para EN antes de salvar:
 *   numeroPedido -> orderId
 *   valorTotal   -> value
 *   dataCriacao  -> creationDate
 */
const orderSchema = new mongoose.Schema({
  // Número único do pedido (mapeado de numeroPedido)
  orderId:      { type: String, required: [true, 'orderId é obrigatório'], unique: true, trim: true },
  // Valor total do pedido (mapeado de valorTotal)
  value:        { type: Number, required: [true, 'value é obrigatório'], min: [0, 'value não pode ser negativo'] },
  // Data de criação do pedido (mapeado de dataCriacao)
  creationDate: { type: Date, required: [true, 'creationDate é obrigatório'] },
  // Lista de itens do pedido
  items: {
    type: [itemSchema],
    validate: {
      validator: (arr) => arr.length > 0,
      message: 'O pedido deve ter pelo menos um item',
    },
  },
}, { versionKey: '__v', timestamps: false });

module.exports = mongoose.model('Order', orderSchema);
