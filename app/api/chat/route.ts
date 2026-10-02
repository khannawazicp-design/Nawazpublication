export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const apiKey = "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";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are Nawaz Academy Expert Teacher. Answer in the same language as the question, verified, 4-6 points." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices) {
      return Response.json({ answer: "Groq Error: " + JSON.stringify(data) });
    }
    return Response.json({ answer: data.choices[0].message.content });

  } catch (e: any) {
    return Response.json({ answer: "Error: " + e.message });
  }
}
