// DTDC Rate Calculator API
// Requires DTDC_CUSTOMER_ID and DTDC_API_KEY environment variables
// Register at https://dtdc.com and request API access to get credentials

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { destinationPin, weightKg } = req.body;
  if (!destinationPin || !weightKg) {
    return res.status(400).json({ error: 'Missing destinationPin or weightKg' });
  }

  const customerId = process.env.DTDC_CUSTOMER_ID;
  const apiKey = process.env.DTDC_API_KEY;

  if (!customerId || !apiKey) {
    return res.status(503).json({ error: 'DTDC credentials not configured' });
  }

  try {
    const response = await fetch('https://blktracksvc.dtdc.com/dtdc-api/rest/JSONCneeAPIService/getComboRate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `${customerId}:${apiKey}`,
      },
      body: JSON.stringify({
        REQUEST_ORIGIN_PINCODE: '534275', // Narsapur, AP
        REQUEST_DEST_PINCODE: destinationPin,
        REQUEST_WEIGHT: weightKg,
        REQUEST_PRODUCT_TYPE: 'Parcel',
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    console.error('DTDC API error:', e);
    res.status(500).json({ error: 'Failed to fetch DTDC rates' });
  }
};
