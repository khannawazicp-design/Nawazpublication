export async function POST(req: Request) {
  const { message, lang } = await req.json();
  const key = process.env.GROQ_API_KEY;
  if (!key) return Response.json({ reply: "API Key missing" });
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: lang==="ur"? "You are Nawaz Publication expert. Explain in detailed Roman Urdu with definition, formulas, example" : "Explain in detail" },
        { role: "user", content: message }
      ]
    })
  });
  const data = await res.json();
  return Response.json({ reply: data.choices?.[0]?.message?.content || "AI Error" });
}
