const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount } = req.body; // amount in paise (INR * 100)

  if (!amount || typeof amount !== 'number' || amount < 1) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: 'mf_' + Date.now(),
    });
    res.status(200).json({ orderId: order.id, amount: order.amount, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    res.status(500).json({ error: 'Could not create payment order' });
  }
};
