import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';

export default async function handler(req, res) {
  const { currency = 'USD' } = req.query;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        convert: currency,
      },
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from CoinMarketCap:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
