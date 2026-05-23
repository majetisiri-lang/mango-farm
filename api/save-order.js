const { Redis } = require('@upstash/redis');
const { Resend } = require('resend');

const NOTIFY_EMAILS = ['majetisiri@gmail.com', 'aksanudeep@gmail.com', 'admin@godavarimangoes.com'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { token, order } = req.body;
  if (!order) return res.status(400).json({ error: 'Missing order' });

  if (token) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const email = await redis.get(`session:${token}`);
    if (email) {
      await redis.lpush(`orders:${email}`, JSON.stringify({
        ...order,
        date: new Date().toISOString(),
      }));
    }
  }

  // Send email notification
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const itemsHtml = (order.items || [])
      .map(i => `<tr><td style="padding:6px 12px">${i.name}</td><td style="padding:6px 12px">${i.qty} kg</td><td style="padding:6px 12px">₹${i.price * i.qty}</td></tr>`)
      .join('');

    await resend.emails.send({
      from: 'Godavari Mangoes <orders@godavarimangoes.com>',
      to: NOTIFY_EMAILS,
      subject: `New Order ${order.orderNum} — ₹${order.total}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a5c36">New Order Received — ${order.orderNum}</h2>
          <p><strong>Payment:</strong> ${order.paymentId === 'COD' ? 'Cash on Delivery' : `Online (${order.paymentId})`}</p>

          <h3 style="margin-top:24px">Customer Details</h3>
          <p>
            <strong>Name:</strong> ${order.name || '—'}<br>
            <strong>Phone:</strong> ${order.phone || '—'}<br>
            <strong>Address:</strong> ${order.address || '—'}, ${order.city || '—'} — ${order.zip || '—'}<br>
            <strong>Zone:</strong> ${order.zone || '—'}
          </p>

          <h3 style="margin-top:24px">Order Items</h3>
          <table style="border-collapse:collapse;width:100%">
            <thead>
              <tr style="background:#f5f5f5">
                <th style="padding:6px 12px;text-align:left">Product</th>
                <th style="padding:6px 12px;text-align:left">Qty</th>
                <th style="padding:6px 12px;text-align:left">Amount</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <p style="margin-top:16px;font-size:1.1rem"><strong>Total: ₹${order.total}</strong></p>
        </div>
      `,
    });
  } catch (e) {
    console.error('Email send error:', e);
  }

  res.status(200).json({ ok: true });
};
