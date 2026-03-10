const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: Number, required: [true, 'productId é obrigatório'] },
  quantity:  { type: Number, required: [true, 'quantity é obrigatório'], min: 1 },
  price:     { type: Number, required: [true, 'price é obrigatório'], min: 0 },
});

const orderSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, unique: true, trim: true },
  value:        { type: Number, required: true, min: 0 },
  creationDate: { type: Date,   required: true },
  items: {
    type: [itemSchema],
    validate: { validator: (arr) => arr.length > 0, message: 'Deve ter pelo menos um item' },
  },
}, { versionKey: '__v', timestamps: false });

module.exports = mongoose.model('Order', orderSchema);
