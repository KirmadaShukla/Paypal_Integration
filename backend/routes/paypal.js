const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const Transaction = require('../models/Transaction');
const environment = new paypal.core.SandboxEnvironment(
  'ARr8FmZCGcV37t3eKdWAh7ozkBX_05YfStcj2B84JklcvWi_tUAvzTtltKpgqdvMyWeYPG8rA5Qp7HW1',
  'EEqDX7uRuSbgXkqz-MsaC0j2tH0zMGvowJ_eSrO-qTliqj6ODq3_V92SHNLhL8Fe5yvVlz-kwFzICxSI'
);

const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
router.post('/create-order/:userId', async (req, res) => {
  try {
    const { total } = req.body;
    const request = new paypalClient.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2)
          }
        }
      ]
    });

    const response = await paypalClient.client().execute(request);
    res.json({ orderId: response.result.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Capture PayPal order
router.post('/capture-order/:userId', async (req, res) => {
  try {
    const { orderId } = req.body;
    const request = new paypalClient.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await paypalClient.client().execute(request);
    const capture = response.result;

    // Save transaction to MongoDB
    const transaction = new Transaction({
      userId: req.params.userId,
      orderId: capture.id,
      status: capture.status,
      amount: parseFloat(capture.purchase_units[0].amount.value),
      currency: capture.purchase_units[0].amount.currency_code
    });
    await transaction.save();

    res.json({ status: capture.status, transactionId: capture.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;