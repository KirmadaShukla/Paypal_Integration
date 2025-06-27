const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [], total: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update cart
router.post('/:userId', async (req, res) => {
  try {
    const { items, total } = req.body;
    let cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items, total },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;