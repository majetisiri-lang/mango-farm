const { Redis } = require('@upstash/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Missing fields' });

  const clean = phone.replace(/[\s\-\+]/g, '').replace(/^(\+91|91)/, '');

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const stored = await redis.get(`phone_otp:${clean}`);
  if (!stored || stored.toString() !== otp.toString()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  await redis.del(`phone_otp:${clean}`);
  res.status(200).json({ ok: true });
};
