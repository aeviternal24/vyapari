export default async function handler(req, res) {
  try {
    const key = process.env.ALPHA_VANTAGE_KEY;
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${key}`
    );
    const data = await response.json();
    const quote = data['Global Quote'];

    if (!quote || !quote['05. price']) {
      return res.json({ sentiment: 'Neutral', change: '0.00%' });
    }

    const change = parseFloat(quote['09. change']);
    const changePct = quote['10. change percent'].replace('%', '').trim();
    const sentiment = change > 1 ? 'Bullish' : change < -1 ? 'Bearish' : 'Neutral';
    const color = change >= 0 ? '+' : '';

    res.json({
      sentiment,
      change: `${color}${parseFloat(changePct).toFixed(2)}%`,
      price: parseFloat(quote['05. price']).toFixed(2),
    });
  } catch (err) {
    res.json({ sentiment: 'Neutral', change: '0.00%' });
  }
}