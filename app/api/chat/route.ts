export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({ reply: "GROQ_API_KEY not found in Vercel" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are Nawaz Academy AI, a helpful teacher for Pakistani students. Answer simply." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return Response.json({ reply: `Groq Error: ${data.error.message}` });
    }

    return Response.json({ reply: data.choices[0].message.content });

  } catch (e: any) {
    return Response.json({ reply: "Server Error: " + e.message });
  }
}
