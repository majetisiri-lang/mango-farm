const { Redis } = require('@upstash/redis');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const { token } = req.query;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  const email = await redis.get(`session:${token}`);
  if (!email) return res.status(401).json({ error: 'Invalid session' });

  const raw = await redis.lrange(`orders:${email}`, 0, -1);
  const orders = raw.map(o => (typeof o === 'string' ? JSON.parse(o) : o));

  res.status(200).json({ email, orders });
};
