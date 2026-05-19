import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Newspaper, BookOpen,
  TrendingUp, DollarSign, BarChart2, Bitcoin, Cpu, Globe,
  Search, Star, ExternalLink, Sparkles, Send, Bot, User,
  RefreshCw, Clock, Zap, Award, Loader2, ChevronRight,
  Briefcase, Building2, Play, FileText, Video, BookMarked,
  Menu, Filter, ArrowUpRight, Tag, Target, GraduationCap,
  AlertCircle, CheckCircle, Lightbulb, PieChart, LineChart
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────

const CLAUDE_MODEL = "claude-sonnet-4-20250514";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "news",      label: "Daily News", icon: Newspaper },
  { id: "chat",      label: "Finance AI",  icon: MessageSquare },
  { id: "learning",  label: "Learning Hub", icon: BookOpen },
];

const NEWS_CATEGORIES = [
  { id: "all",      label: "All",      icon: Globe },
  { id: "markets",  label: "Markets",  icon: TrendingUp },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "startup",  label: "Startups", icon: Zap },
  { id: "economy",  label: "Economy",  icon: Building2 },
  { id: "tech",     label: "Tech",     icon: Cpu },
  { id: "crypto",   label: "Crypto",   icon: Bitcoin },
];

const QUICK_PROMPTS = [
  "How should I allocate my investment portfolio as a beginner?",
  "What are best strategies for small business cash flow management?",
  "Explain P/E ratio and how to use it for stock valuation",
  "How do I create a business plan for a startup in 2025?",
  "What tax deductions can small business owners claim?",
  "How do I evaluate whether to acquire another business?",
];

const LEARNING_RESOURCES = [
  {
    id: 1,
    title: "Financial Statement Analysis Masterclass",
    type: "course", category: "finance basics", level: "intermediate",
    rating: 4.8, duration: "12 hrs",
    description: "Learn to read and interpret balance sheets, income statements, and cash flow statements like a professional analyst.",
    url: "https://www.coursera.org/learn/financial-analysis",
    provider: "Coursera",
  },
  {
    id: 2,
    title: "The Intelligent Investor: Key Principles",
    type: "article", category: "investing", level: "beginner",
    rating: 4.9, duration: "20 min",
    description: "Benjamin Graham's timeless value investing principles, condensed with commentary for modern market conditions.",
    url: "https://www.investopedia.com/articles/basics/07/grahamprinciples.asp",
    provider: "Investopedia",
  },
  {
    id: 3,
    title: "How to Build a Startup from Scratch",
    type: "video", category: "entrepreneurship", level: "beginner",
    rating: 4.7, duration: "45 min",
    description: "Y Combinator's Paul Graham on the core principles of building a successful company from zero to product-market fit.",
    url: "https://www.youtube.com/watch?v=0lJKucu6HJc",
    provider: "YouTube",
  },
  {
    id: 4,
    title: "Double-Entry Bookkeeping Explained",
    type: "blog", category: "accounting", level: "beginner",
    rating: 4.5, duration: "15 min",
    description: "A clear, jargon-free walkthrough of double-entry accounting—the foundation of modern bookkeeping systems.",
    url: "https://bench.co/blog/accounting/double-entry-accounting/",
    provider: "Bench",
  },
  {
    id: 5,
    title: "Advanced Options Trading Strategies",
    type: "course", category: "investing", level: "advanced",
    rating: 4.6, duration: "20 hrs",
    description: "Master options Greeks, vertical spreads, iron condors, and risk-defined hedging strategies for portfolio income.",
    url: "https://www.tastytrade.com/learn",
    provider: "tastytrade",
  },
  {
    id: 6,
    title: "Porter's Five Forces: Competitive Analysis",
    type: "article", category: "business strategy", level: "intermediate",
    rating: 4.7, duration: "10 min",
    description: "Apply Porter's framework to assess industry attractiveness, competitive intensity, and sustainable advantage.",
    url: "https://hbr.org/1979/03/how-competitive-forces-shape-strategy",
    provider: "Harvard Business Review",
  },
  {
    id: 7,
    title: "Technical Analysis Fundamentals",
    type: "course", category: "market analysis", level: "intermediate",
    rating: 4.5, duration: "8 hrs",
    description: "Chart patterns, candlestick formations, RSI, MACD, and moving averages for smarter trading entry/exit decisions.",
    url: "https://www.babypips.com/learn/forex",
    provider: "BabyPips",
  },
  {
    id: 8,
    title: "Startup Valuation Methods Demystified",
    type: "blog", category: "entrepreneurship", level: "intermediate",
    rating: 4.6, duration: "12 min",
    description: "Pre-money vs post-money, Berkus method, DCF, and comparable company analysis explained for founders.",
    url: "https://a16z.com/",
    provider: "Andreessen Horowitz",
  },
  {
    id: 9,
    title: "GST & Tax Compliance for Indian SMBs",
    type: "video", category: "accounting", level: "beginner",
    rating: 4.4, duration: "30 min",
    description: "Everything Indian small business owners need to know about GST registration, filing, and staying compliant.",
    url: "https://www.youtube.com/results?search_query=gst+for+small+business+india",
    provider: "YouTube",
  },
  {
    id: 10,
    title: "Macroeconomics for Investors",
    type: "course", category: "market analysis", level: "advanced",
    rating: 4.8, duration: "15 hrs",
    description: "How GDP, inflation, interest rate cycles, and central bank policy decisions impact asset prices across markets.",
    url: "https://www.edx.org/learn/economics",
    provider: "edX",
  },
  {
    id: 11,
    title: "Zero to One: Lessons from Peter Thiel",
    type: "article", category: "business strategy", level: "beginner",
    rating: 4.9, duration: "18 min",
    description: "Contrarian principles on building companies that create genuine monopolies rather than competing in existing markets.",
    url: "https://medium.com/the-mission/peter-thiels-zero-to-one-23-key-insights-summary-c7f8f76e1d56",
    provider: "Medium",
  },
  {
    id: 12,
    title: "Personal Finance Fundamentals",
    type: "course", category: "finance basics", level: "beginner",
    rating: 4.7, duration: "6 hrs",
    description: "Budgeting frameworks, emergency fund strategy, debt prioritization, and wealth-building habits from your first salary.",
    url: "https://nptel.ac.in/courses/110/105/110105032/",
    provider: "NPTEL",
  },
  {
    id: 13,
    title: "Reading Market Cycles with Howard Marks",
    type: "article", category: "investing", level: "advanced",
    rating: 4.8, duration: "25 min",
    description: "Oaktree Capital's Howard Marks explains how to recognize market cycle positioning and adjust risk accordingly.",
    url: "https://www.oaktreecapital.com/insights/memo",
    provider: "Oaktree Capital",
  },
  {
    id: 14,
    title: "Unit Economics for Startups",
    type: "blog", category: "entrepreneurship", level: "intermediate",
    rating: 4.5, duration: "10 min",
    description: "LTV, CAC, payback period, and cohort analysis—the metrics every founder must track to achieve scalable growth.",
    url: "https://a16z.com/",
    provider: "a16z",
  },
  {
    id: 15,
    title: "Blue Ocean Strategy Explained",
    type: "video", category: "business strategy", level: "intermediate",
    rating: 4.6, duration: "20 min",
    description: "How to create uncontested market space and make competition irrelevant using the ERRC grid and value innovation.",
    url: "https://www.youtube.com/results?search_query=blue+ocean+strategy",
    provider: "YouTube",
  },
];

const IMPORTANCE_STYLES = {
  high:   { bg: "#ef44441a", border: "#ef4444", text: "#ef4444" },
  medium: { bg: "#f59e0b1a", border: "#f59e0b", text: "#f59e0b" },
  low:    { bg: "#10b9811a", border: "#10b981", text: "#10b981" },
};

const TYPE_ICONS = { course: Award, blog: FileText, video: Video, article: BookMarked };
const LEVEL_COLORS = { beginner: "#10b981", intermediate: "#f59e0b", advanced: "#ef4444" };

// ── API Helper ───────────────────────────────────────────────────────────────

async function callClaudeAPI(messages, systemPrompt = "", useWebSearch = false) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      system: systemPrompt || undefined,
      useWebSearch,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Shared Components ────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: "#0f1729", border: `1px solid #1a2540`,
        borderLeft: `3px solid ${color}`, borderRadius: 14,
        padding: "18px 20px", display: "flex",
        justifyContent: "space-between", alignItems: "flex-start",
      }}
    >
      <div>
        <p style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Sora', sans-serif", lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: sub.startsWith("+") ? "#10b981" : "#ef4444", marginTop: 6 }}>{sub}</p>}
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={19} color={color} />
      </div>
    </motion.div>
  );
}

function NewsCard({ item, index = 0 }) {
  const imp = IMPORTANCE_STYLES[item.importance] || IMPORTANCE_STYLES.medium;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      style={{
        background: "#0f1729", border: `1px solid #1a2540`,
        borderLeft: `3px solid ${imp.border}`,
        borderRadius: 12, padding: "16px",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      whileHover={{ y: -2 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: imp.text, background: imp.bg, padding: "2px 8px", borderRadius: 4 }}>
          {item.importance}
        </span>
        <span style={{ fontSize: 11, color: "#3d5068", display: "flex", alignItems: "center", gap: 4 }}>
          <Clock size={11} /> {item.date || "Today"}
        </span>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 7, lineHeight: 1.45 }}>{item.headline}</h3>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, marginBottom: 12 }}>{item.summary}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#3d5068", background: "#131e30", padding: "2px 8px", borderRadius: 4 }}>{item.source}</span>
        <span style={{ fontSize: 11, color: "#f59e0b", background: "#f59e0b14", padding: "2px 8px", borderRadius: 4, textTransform: "capitalize" }}>{item.category}</span>
      </div>
    </motion.div>
  );
}

function ResourceCard({ resource }) {
  const TypeIcon = TYPE_ICONS[resource.type] || FileText;
  const lvlColor = LEVEL_COLORS[resource.level] || "#64748b";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3, borderColor: "#f59e0b33" }}
      style={{
        background: "#0f1729", border: "1px solid #1a2540",
        borderRadius: 14, padding: "18px",
        display: "flex", flexDirection: "column", gap: 0,
        transition: "border-color 0.2s, transform 0.2s",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f59e0b14", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TypeIcon size={16} color="#f59e0b" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontSize: 11, color: "#3d5068", textTransform: "capitalize" }}>{resource.type}</span>
            <span style={{ fontSize: 11, color: lvlColor, background: `${lvlColor}14`, padding: "1px 7px", borderRadius: 4, textTransform: "capitalize" }}>{resource.level}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>{resource.rating}</span>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 8, lineHeight: 1.4 }}>{resource.title}</h3>
      <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{resource.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1a2540", paddingTop: 12 }}>
        <span style={{ fontSize: 11, color: "#3d5068" }}>
          <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
          {resource.duration} · {resource.provider}
        </span>
        <a href={resource.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#f59e0b", fontWeight: 700, textDecoration: "none" }}>
          Open <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, message, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "56px 24px", textAlign: "center" }}>
      <Icon size={40} color="#1e3a5f" />
      <p style={{ color: "#3d5068", fontSize: 14 }}>{message}</p>
      {action}
    </div>
  );
}

function AmberButton({ onClick, disabled, loading, children, small }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: small ? "6px 14px" : "9px 20px",
        background: disabled || loading ? "#1e2d3d" : "#f59e0b",
        color: disabled || loading ? "#3d5068" : "#0a0f1e",
        border: "none", borderRadius: 10,
        fontWeight: 700, fontSize: small ? 12 : 14,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage({ allNews, onNavigate }) {
  const [market, setMarket] = useState({ sentiment: 'Loading...', change: '' });

  useEffect(() => {
    fetch('/api/market')
      .then(r => r.json())
      .then(data => setMarket(data))
      .catch(() => setMarket({ sentiment: 'Unavailable', change: '' }));
  }, []);
  const recentNews = allNews.slice(0, 3);
  const featured = LEARNING_RESOURCES.filter((r) => r.rating >= 4.8).slice(0, 3);

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={styles.pageTitle}>Welcome to Vyapari 👋</h1>
        <p style={styles.pageSubtitle}>Your AI-powered business intelligence platform.</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 34 }}>
        <StatCard label="News Loaded" value={allNews.length || "0"} sub={allNews.length ? "+live" : null} icon={Newspaper} color="#f59e0b" delay={0.05} />
        <StatCard label="Market Sentiment" value={market.sentiment} sub={market.change} icon={TrendingUp} color="#10b981" delay={0.1} />
        <StatCard label="Resources" value={LEARNING_RESOURCES.length} icon={BookOpen} color="#6366f1" delay={0.15} />
        <StatCard label="AI Queries" value="∞" icon={Sparkles} color="#ec4899" delay={0.2} />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Recent News */}
        <div>
          <SectionHeader title="Latest News" action="View all" onAction={() => onNavigate("news")} />
          {recentNews.length > 0
            ? recentNews.map((n, i) => <NewsCard key={i} item={n} index={i} />)
            : <EmptyState icon={Newspaper} message="No news loaded yet."
                action={<AmberButton onClick={() => onNavigate("news")} small><Sparkles size={13} /> Generate News</AmberButton>} />}
        </div>

        {/* Featured Resources */}
        <div>
          <SectionHeader title="Top Resources" action="View all" onAction={() => onNavigate("learning")} />
          {featured.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 30 }}>
        <SectionHeader title="Quick Actions" />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Ask Finance AI", icon: MessageSquare, page: "chat", color: "#6366f1" },
            { label: "Today's News", icon: Newspaper, page: "news", color: "#f59e0b" },
            { label: "Learning Hub", icon: BookOpen, page: "learning", color: "#10b981" },
          ].map((a) => (
            <motion.button key={a.page} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate(a.page)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 10,
                border: `1px solid ${a.color}28`, background: `${a.color}0e`,
                color: a.color, fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>
              <a.icon size={15} /> {a.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>{title}</h2>
      {action && (
        <button onClick={onAction}
          style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", background: "transparent", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          {action} <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ── News Page ────────────────────────────────────────────────────────────────

function NewsPage({ allNews, setAllNews }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateNews = async () => {
    setLoading(true);
    setError("");
    const cat = activeCategory === "all" ? "general business, finance, and markets" : activeCategory;
    const prompt = `Search the web for the LATEST ${cat} news from today or this week. Find 5 real, current news stories.

Return ONLY a valid JSON array (no markdown code fences, no explanation text, just the array). Use this exact structure:
[
  {
    "headline": "Short, specific news headline",
    "summary": "2-3 sentence summary with key facts and why it matters to business professionals",
    "category": "${activeCategory === "all" ? "business" : activeCategory}",
    "importance": "high",
    "source": "Publication Name",
    "date": "Today"
  }
]

Importance levels: high = major market-moving news, medium = notable developments, low = general updates. Mix importance levels across the 5 items.`;

    try {
      const text = await callClaudeAPI(
        [{ role: "user", content: prompt }],
        "You are a business news aggregator AI. You always return only valid JSON arrays with no surrounding text or markdown.",
        true
      );
      const startIdx = text.indexOf("[");
      const endIdx = text.lastIndexOf("]");
      if (startIdx === -1) throw new Error("No JSON array found");
      const items = JSON.parse(text.slice(startIdx, endIdx + 1));
      setAllNews((prev) => {
        const filtered = prev.filter((n) => n.category !== items[0]?.category);
        return [...items, ...filtered];
      });
    } catch {
      setError("Failed to generate news. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeCategory === "all"
    ? allNews
    : allNews.filter((n) => n.category?.toLowerCase() === activeCategory);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={styles.pageTitle}>Daily News</h1>
          <p style={styles.pageSubtitle}>AI-curated intelligence scraped from across the financial web</p>
        </div>
        <AmberButton onClick={generateNews} loading={loading}>
          {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={15} />}
          {loading ? "Generating…" : "Generate News"}
        </AmberButton>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {NEWS_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                cursor: "pointer", transition: "all 0.18s", fontFamily: "'DM Sans', sans-serif",
                background: active ? "#f59e0b" : "#0f1729",
                color: active ? "#0a0f1e" : "#475569",
                border: active ? "1px solid #f59e0b" : "1px solid #1a2540",
              }}>
              <cat.icon size={12} /> {cat.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={{ background: "#ef44441a", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 16px", marginBottom: 18, color: "#ef4444", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "52px 0" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
            <Sparkles size={32} color="#f59e0b" />
          </motion.div>
          <p style={{ color: "#475569", fontSize: 14 }}>Scraping and summarising the latest news…</p>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState icon={Newspaper} message="No news in this category yet. Hit Generate to load the latest."
          action={<AmberButton onClick={generateNews}><Sparkles size={14} /> Generate Now</AmberButton>} />
      )}

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
          {filtered.map((item, i) => <NewsCard key={i} item={item} index={i} />)}
        </div>
      )}
    </div>
  );
}

// ── Finance AI Chat Page ─────────────────────────────────────────────────────

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your Vyapari Finance AI — an expert in investments, business strategy, accounting, and entrepreneurship.\n\nI can search the web for real-time data and give you personalised advice. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const reply = await callClaudeAPI(
        history,
        `You are Vyapari Finance AI — a world-class financial advisor, business strategist, and entrepreneurship coach. You provide personalised, actionable, and nuanced advice.

Guidelines:
- Use web search for current prices, recent news, and real-time data
- Structure complex answers with clear sections using markdown-style formatting
- Give specific, practical recommendations — not generic platitudes
- When discussing investments, always mention risk appropriately
- Keep responses concise but complete — no padding
- Speak naturally, like a knowledgeable trusted friend`,
        true
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "I encountered an error retrieving that information. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const showPrompts = messages.length <= 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={styles.pageTitle}>Finance AI</h1>
        <p style={styles.pageSubtitle}>Ask anything — investments, strategy, accounting, markets, entrepreneurship</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, display: "flex", flexDirection: "column", gap: 18 }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: msg.role === "user" ? "#f59e0b14" : "#6366f114",
                border: `1.5px solid ${msg.role === "user" ? "#f59e0b28" : "#6366f128"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {msg.role === "user" ? <User size={17} color="#f59e0b" /> : <Bot size={17} color="#818cf8" />}
              </div>
              <div style={{
                maxWidth: "78%",
                background: msg.role === "user" ? "#f59e0b0a" : "#0f1729",
                border: `1px solid ${msg.role === "user" ? "#f59e0b1a" : "#1a2540"}`,
                borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                padding: "12px 16px",
                color: "#cbd5e1", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#6366f114", border: "1.5px solid #6366f128", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={17} color="#818cf8" />
            </div>
            <div style={{ background: "#0f1729", border: "1px solid #1a2540", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.75, delay: i * 0.15 }}
                    style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8" }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <AnimatePresence>
        {showPrompts && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "#3d5068", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 9 }}>Suggested questions</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    background: "#0f1729", color: "#64748b",
                    border: "1px solid #1a2540", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#0f1729", borderRadius: 14, border: "1px solid #1a2540" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
          placeholder="Ask about investments, business strategy, tax planning…"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
        />
        <motion.button whileHover={{ scale: input.trim() ? 1.08 : 1 }} whileTap={{ scale: 0.93 }}
          onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, borderRadius: 10, border: "none",
            background: input.trim() && !loading ? "#f59e0b" : "#131e30",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}>
          <Send size={15} color={input.trim() && !loading ? "#0a0f1e" : "#2d3f55"} />
        </motion.button>
      </div>
    </div>
  );
}

// ── Learning Hub Page ────────────────────────────────────────────────────────

function LearningPage() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType]         = useState("all");
  const [level, setLevel]       = useState("all");

  const categories = ["all", "finance basics", "investing", "business strategy", "accounting", "entrepreneurship", "market analysis"];
  const types      = ["all", "course", "blog", "video", "article"];
  const levels     = ["all", "beginner", "intermediate", "advanced"];

  const filtered = LEARNING_RESOURCES.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q);
    return matchSearch
      && (category === "all" || r.category === category)
      && (type === "all" || r.type === type)
      && (level === "all" || r.level === level);
  });

  function Pills({ options, active, setActive }) {
    return (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => setActive(opt)}
            style={{
              padding: "4px 12px", borderRadius: 16, fontSize: 11, fontWeight: 700,
              cursor: "pointer", textTransform: "capitalize", fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.15s",
              background: active === opt ? "#f59e0b" : "#0f1729",
              color: active === opt ? "#0a0f1e" : "#475569",
              border: active === opt ? "1px solid #f59e0b" : "1px solid #1a2540",
            }}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={styles.pageTitle}>Learning Hub</h1>
        <p style={styles.pageSubtitle}>Curated resources for your financial and business education</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <Search size={15} color="#3d5068" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses, articles, videos…"
          style={{
            width: "100%", padding: "11px 14px 11px 40px", borderRadius: 11,
            background: "#0f1729", border: "1px solid #1a2540", color: "#e2e8f0",
            fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ background: "#0a1020", borderRadius: 12, border: "1px solid #1a2540", padding: "16px 18px", marginBottom: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "Category", options: categories, active: category, setActive: setCategory },
          { label: "Type",     options: types,      active: type,     setActive: setType },
          { label: "Level",    options: levels,     active: level,    setActive: setLevel },
        ].map((f) => (
          <div key={f.label}>
            <p style={{ fontSize: 10, color: "#2d4060", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{f.label}</p>
            <Pills options={f.options} active={f.active} setActive={f.setActive} />
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#3d5068", marginBottom: 16 }}>
        <span style={{ color: "#f59e0b", fontWeight: 700 }}>{filtered.length}</span> resources found
      </p>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} message="No resources match your filters. Try adjusting them." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {filtered.map((r) => <ResourceCard key={r.id} resource={r} />)}
        </div>
      )}
    </div>
  );
}

// ── Shared Styles ────────────────────────────────────────────────────────────

const styles = {
  pageTitle:    { fontSize: 24, fontWeight: 800, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Sora', sans-serif" },
  pageSubtitle: { color: "#3d5068", fontSize: 13, marginBottom: 26 },
};

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [allNews, setAllNews]         = useState([]);
  const [collapsed, setCollapsed]     = useState(false);

  const PAGES = { dashboard: DashboardPage, news: NewsPage, chat: ChatPage, learning: LearningPage };
  const PageComponent = PAGES[currentPage];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; display: flex; flex: 1; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a2540; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #253350; }
        input::placeholder { color: #2d4060; }
      `}</style>

      <div style={{ display: "flex",width: "100vw", height: "100vh", background: "#070d17", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Sidebar ── */}
        <motion.aside
          animate={{ width: collapsed ? 58 : 214 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          style={{ background: "#060c16", borderRight: "1px solid #0d1626", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}
        >
          {/* Logo */}
          <div style={{ padding: collapsed ? "18px 13px" : "18px 16px", borderBottom: "1px solid #0d1626", display: "flex", alignItems: "center", gap: 10, minHeight: 64 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={17} color="#0a0f1e" strokeWidth={2.5} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  style={{ fontSize: 19, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Sora', sans-serif", whiteSpace: "nowrap" }}>
                  Vyapari
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "10px 8px" }}>
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <motion.button key={item.id} onClick={() => setCurrentPage(item.id)}
                  whileHover={{ x: 2 }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 11,
                    padding: collapsed ? "11px 13px" : "11px 13px",
                    borderRadius: 10, border: "none",
                    background: active ? "#f59e0b12" : "transparent",
                    color: active ? "#f59e0b" : "#3d5068",
                    cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500,
                    marginBottom: 3, fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.15s, background 0.15s",
                    justifyContent: collapsed ? "center" : "flex-start",
                    whiteSpace: "nowrap", overflow: "hidden",
                  }}>
                  <item.icon size={17} style={{ flexShrink: 0 }} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && !collapsed && (
                    <motion.div layoutId="activeIndicator"
                      style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#f59e0b" }} />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <div style={{ padding: "12px 8px", borderTop: "1px solid #0d1626" }}>
            <button onClick={() => setCollapsed((c) => !c)}
              style={{
                width: "100%", padding: "9px", borderRadius: 9, border: "1px solid #0d1626",
                background: "transparent", color: "#253350", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.15s",
              }}>
              <Menu size={15} />
            </button>
          </div>
        </motion.aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          {/* Dot-grid background pattern */}
          <div style={{
            position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
            backgroundImage: "radial-gradient(circle, #1a2540 1px, transparent 1px)",
            backgroundSize: "32px 32px", opacity: 0.35,
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div key={currentPage}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <PageComponent allNews={allNews} setAllNews={setAllNews} onNavigate={setCurrentPage} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
