# 📈 Vyapari — AI-Powered Business Intelligence Platform

Vyapari is a full-stack web application I built to solve a real problem — information overload for business professionals. Instead of spending hours across multiple news sites, financial blogs, and learning platforms, Vyapari brings everything into one unified, AI-powered interface.

Live Demo: [vyapari-yair-git-main-abhi-s-projects24.vercel.app](vyapari-yair-git-main-abhi-s-projects24.vercel.app)

---

## What I Built

### Finance AI Chatbot
I built an intelligent chatbot that answers questions across finance, investing, business strategy, accounting, and entrepreneurship. It doesn't just rely on pre-trained knowledge — it searches the web in real time before responding, so the answers are always current and grounded in actual data. I maintained full conversation history so users can have multi-turn, contextual discussions rather than isolated queries.

### Daily News Generation
I implemented an automated news pipeline that scrapes and summarises real-time business news across six categories — markets, business, startups, economy, tech, and crypto. Each news item is AI-generated with a headline, a 2-3 sentence summary, a source attribution, and an importance level (high, medium, low) so users can prioritise what to read first.

### Live Market Sentiment
I connected the Alpha Vantage financial API to pull live S&P 500 data and calculate real-time market sentiment. The dashboard shows whether the market is Bullish, Neutral, or Bearish based on actual intraday price movement — not a hardcoded value.

### Learning Hub
I curated and organised 15 high-quality learning resources across finance basics, investing, accounting, business strategy, entrepreneurship, and market analysis. Users can filter by category, content type (course, article, video, blog), and difficulty level (beginner, intermediate, advanced), and search across all resources by keyword.

### Dashboard
I designed a unified dashboard that gives users an at-a-glance overview — live market sentiment, recent news highlights, top-rated learning resources, and quick action buttons to jump into any module instantly.

---

## How It Works

The core challenge I solved was keeping API keys secure while still enabling real-time AI and web search from a browser-based app. I built a server-side proxy layer that sits between the frontend and all external APIs — the browser never communicates with Groq, Tavily, or Alpha Vantage directly. All sensitive credentials live in environment variables on the server, never in the client-side code.

When a user generates news or asks the Finance AI a question, the request flows through my proxy which first queries Tavily for live web search results, injects those results as context into the prompt, and then sends everything to Groq's LLaMA 3.3 70B model. The model synthesises the search data into a coherent, up-to-date response. This architecture means the AI always has access to current information beyond its training cutoff.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Framer Motion, Lucide React |
| Backend | Node.js, Express.js |
| AI Model | Groq API — LLaMA 3.3 70B |
| Web Search | Tavily Search API |
| Market Data | Alpha Vantage API |
| Deployment | Vercel — Serverless Functions + CI/CD |
| Version Control | Git, GitHub |

---

## Architecture

```
Browser (React Frontend)
        ↓
  /api/claude (Serverless Proxy)
        ↓                    ↓
  Tavily Search API     Groq LLaMA 3.3 70B
  (Live web results)    (AI synthesis)
        ↓
  Final response to user

  /api/market (Serverless Proxy)
        ↓
  Alpha Vantage API → Live S&P 500 sentiment
```

---

## Project Structure

```
vyapari/
├── api/
│   ├── claude.js        # AI + web search proxy
│   └── market.js        # Market sentiment proxy
├── src/
│   ├── App.jsx          # Entire React application
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── server.js            # Express server for local development
├── vercel.json          # Vercel configuration
├── index.html
├── package.json
└── vite.config.js
```

---

## Challenges I Solved

**API key security** — Direct browser-to-API calls expose secret keys in developer tools. I solved this by routing all external API calls through a server-side Express proxy, keeping keys exclusively in environment variables.

**Real-time AI responses** — Standard LLMs have a training cutoff and can't answer questions about current events. I solved this by integrating Tavily web search into every AI request, giving the model live context before generating a response.

**Windows environment encoding** — The `.env` file created via PowerShell was saved in UTF-16 encoding, causing Node.js to fail silently when reading API keys. I diagnosed this by logging raw file bytes and fixed it by recreating the file through Node.js directly, which writes UTF-8 by default.

**Git secret exposure** — An early commit accidentally included the `.env` file before `.gitignore` was configured correctly. GitHub's push protection blocked the push. I resolved it by rewriting the git history, removing the file from all commits, and regenerating the exposed keys.

**Serverless vs local architecture** — Express routes work locally but Vercel requires each endpoint to be a separate file in the `api/` folder to function as serverless functions. I restructured the backend accordingly so the same logic works both locally and in production.

---

## Limitations

- Alpha Vantage free tier allows 25 API calls per day
- Chat history does not persist between browser sessions
- No user authentication — all users share the same interface

---

## Future Scope

- User authentication and personalised news feeds
- Persistent chat history via a database
- Streaming AI responses token by token
- Real-time stock portfolio tracker
- Mobile-optimised responsive layout

---

Built by [Abhi](https://github.com/aeviternal24)
