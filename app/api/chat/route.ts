export async function POST(req: Request) {
  const { message, lang } = await req.json();
  const key = process.env.GROQ_API_KEY;
  if (!key) return Response.json({ reply: "Key nahi mili" });

  const langPrompt = lang === "ur"? "Explain in detailed Urdu (Roman Urdu + some Urdu script), with Definition, Types, Formulas, Example, Exam Tip for 9th-12th" : lang === "ps"? "Explain in Pashto detailed" : "Explain in detailed English";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: `You are Nawaz Publication AI Teacher. ${langPrompt}. Be to-the-point.` },
        { role: "user", content: message }
      ]
    })
  });
  const data = await res.json();
  return Response.json({ reply: data.choices?.[0]?.message?.content || "AI Error" });
}
