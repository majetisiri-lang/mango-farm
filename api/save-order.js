const { Redis } = require('@upstash/redis');
const { Resend } = require('resend');

const NOTIFY_EMAILS = ['majetisiri@gmail.com', 'aksanudeep@gmail.com', 'admin@godavarimangoes.com', 'alsramya@gmail.com'];

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
    const ZONE_LABELS = { ap: 'Andhra Pradesh — Door Delivery (DTDC)', south: 'South India — Door Delivery (DTDC)', pickup: 'Farm Pickup (Narsapur)', anl: 'Cheaper Option — ANL/Navitha Branch Pickup' };
    const zoneLabel = ZONE_LABELS[order.zone] || order.zone || '—';
    const shippingLine = order.shipping > 0 ? `₹${order.shipping} (₹${Math.round(order.shipping / (order.totalKg || 1))}/kg × ${order.totalKg} kg)` : 'Free';

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
            <strong>Address:</strong> ${order.address || '—'}, ${order.city || '—'} — ${order.zip || '—'}
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

          <h3 style="margin-top:24px">Pricing</h3>
          <p>
            <strong>Subtotal:</strong> ₹${order.subtotal || '—'}<br>
            <strong>Delivery:</strong> ${zoneLabel}<br>
            <strong>Shipping:</strong> ${shippingLine}<br>
            <strong style="font-size:1.1rem">Total: ₹${order.total}</strong>
          </p>
        </div>
      `,
    });
  } catch (e) {
    console.error('Email send error:', e);
  }

  res.status(200).json({ ok: true });
};
