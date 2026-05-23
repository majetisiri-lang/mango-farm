const { Resend } = require('resend');
const { Redis } = require('@upstash/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  await redis.set(`otp:${email}`, otp, { ex: 600 }); // expires in 10 min

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Godavari Mangoes <noreply@godavarimangoes.com>',
    to: email,
    subject: 'Your login OTP — Godavari Mangoes',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fffdf5;border-radius:12px;">
        <h2 style="color:#2e7d32;margin-bottom:8px;">🥭 Godavari Mangoes</h2>
        <p style="color:#555;">Use the OTP below to log in. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2e7d32;background:#fff;border:2px solid #e0e0e0;border-radius:10px;padding:20px;text-align:center;margin:24px 0;">${otp}</div>
        <p style="color:#999;font-size:.8rem;">If you didn't request this, please ignore this email.</p>
      </div>`,
  });

  if (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }

  res.status(200).json({ ok: true });
};
