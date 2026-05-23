const { Redis } = require('@upstash/redis');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Missing fields' });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const stored = await redis.get(`otp:${email}`);
  if (!stored || stored.toString() !== otp.toString()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  await redis.del(`otp:${email}`); // one-time use

  const token = crypto.randomBytes(32).toString('hex');
  await redis.set(`session:${token}`, email, { ex: 60 * 60 * 24 * 30 }); // 30 days

  res.status(200).json({ ok: true, token, email });
};
