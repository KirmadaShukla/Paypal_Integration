const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    title: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String
  }],
  total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);