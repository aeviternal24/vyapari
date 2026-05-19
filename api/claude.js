export default async function handler(req, res) {
  try {
    const { messages, system, useWebSearch } = req.body;

    let searchContext = "";

    // If web search is needed, search Tavily first
    if (useWebSearch) {
      const lastMessage = messages[messages.length - 1]?.content || "";

      // Extract a clean search query from the message
      const searchQuery = lastMessage.length > 100
        ? lastMessage.substring(0, 100)
        : lastMessage;

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

        // Build context from search results
        if (tavilyData.results?.length > 0) {
          searchContext = "\n\nHere is real-time web search data to help answer:\n";
          tavilyData.results.forEach((r, i) => {
            searchContext += `\nSource ${i + 1}: ${r.title}\nURL: ${r.url}\nContent: ${r.content}\n`;
          });
          searchContext += "\nUse the above search results to give an accurate, up-to-date answer.";
        }
      } catch (searchErr) {
        console.error("Tavily search failed:", searchErr);
        // Continue without search results if Tavily fails
      }
    }

    // Build messages for Groq
    const systemPrompt = (system || "") + searchContext;
    const groqMessages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.map(m => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      })),
    ];

    // Call Groq
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
    res.status(groqRes.status).json(groqData);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}