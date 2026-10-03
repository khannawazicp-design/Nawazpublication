export async function POST(req: Request) {
  const { message } = await req.json();
  const apiKey = process.env.GROQ_API_KEY!;
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{role:"system", content:"You are Nawaz Academy, a professional helpful teacher for Pakistani students. Answer clearly in simple English/Urdu."},{role:"user", content: message}],
    })
  });
  const d = await r.json();
  return Response.json({ reply: d.choices?.[0]?.message?.content || "Error: " + JSON.stringify(d.error) });
}
