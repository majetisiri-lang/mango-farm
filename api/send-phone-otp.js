const { Redis } = require('@upstash/redis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const digits = phone.replace(/[\s\-\+]/g, '');
  const clean = digits.replace(/^(\+91|91)/, '');

  const TEST_PHONES = ['7576852052', '3108691650'];
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  if (TEST_PHONES.includes(clean)) {
    await redis.set(`phone_otp:${clean}`, '000000', { ex: 300 });
    return res.status(200).json({ ok: true, testOtp: '000000' });
  }

  if (!/^[6-9]\d{9}$/.test(clean)) {
    return res.status(400).json({ error: 'Invalid Indian mobile number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`phone_otp:${clean}`, otp, { ex: 300 });

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': process.env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'otp',
      variables_values: otp,
      numbers: clean,
    }),
  });

  const data = await response.json();
  if (!data.return) {
    console.error('Fast2SMS error:', JSON.stringify(data));
    const msg = (Array.isArray(data.message) ? data.message.join(', ') : data.message) || JSON.stringify(data);
    return res.status(500).json({ error: msg });
  }

  res.status(200).json({ ok: true });
};
