const { Redis } = require('@upstash/redis');

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

  res.status(200).json({ ok: true });
};
