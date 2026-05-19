import 'dotenv/config';
import { readFileSync } from 'fs';
const raw = readFileSync('.env', 'utf8');
console.log("Raw .env file:", JSON.stringify(raw.substring(0, 100)));
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

console.log("Groq key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");
console.log("Tavily key loaded:", process.env.TAVILY_API_KEY ? "YES" : "NO");

app.post('/api/claude', async (req, res) => {
  try {
    const { messages, system, useWebSearch } = req.body;
    let searchContext = "";

    if (useWebSearch) {
      const lastMessage = messages[messages.length - 1]?.content || "";
      const searchQuery = lastMessage.substring(0, 100);

      console.log("Searching Tavily for:", searchQuery);

      try {
        const tavilyRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: searchQuery,
            search_depth: "basic",
            max_results: 5,
            include_answer: true,
          }),
        });
        const tavilyData = await tavilyRes.json();
        console.log("Tavily response status:", tavilyRes.status);
        console.log("Tavily data:", JSON.stringify(tavilyData).substring(0, 200));

        if (tavilyData.results?.length > 0) {
          searchContext = "\n\nReal-time web search results:\n";
          tavilyData.results.forEach((r, i) => {
            searchContext += `\nSource ${i + 1}: ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`;
          });
          searchContext += "\nUse these results to give an accurate, up-to-date answer.";
        }
      } catch (err) {
        console.error("Tavily error:", err);
      }
    }

    const systemPrompt = (system || "") + searchContext;
    const groqMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      })),
    ];

    console.log("Calling Groq...");

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 1000,
      }),
    });

    const groqData = await groqRes.json();
    console.log("Groq response status:", groqRes.status);
    console.log("Groq data:", JSON.stringify(groqData).substring(0, 200));

    res.status(groqRes.status).json(groqData);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/market', async (req, res) => {
  try {
    const key = process.env.ALPHA_VANTAGE_KEY;
    
    // Fetch S&P 500 data
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
    console.error('Market error:', err);
    res.json({ sentiment: 'Neutral', change: '0.00%' });
  }
});
app.listen(3001, () => console.log('Proxy running on http://localhost:3001'));