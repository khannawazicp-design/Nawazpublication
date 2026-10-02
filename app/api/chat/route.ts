export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    // NAYI KEY YAHAN LAGAYI HAI
    const apiKey = "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";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You are AI Ustad from NawazAcademy. If user writes Urdu, reply in Urdu. If English, reply in English. Be professional like ChatGPT." },
          { role: "user", content: message }
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) return Response.json({ reply: `Groq Error: ${data.error?.message}` });
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message });
  }
}
