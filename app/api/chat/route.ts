export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // YAHAN APNI NAYI KEY PASTE KAREN
    const apiKey = "YAHAN_NAYI_KEY_PASTE_KAREN";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Tum Nawaz Academy ke Expert Teacher ho. Jis zaban me sawal ho usi me jawab do. Sahi verified jawab 4-6 points me do." },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return Response.json({ answer: "Error: " + JSON.stringify(data).slice(0,200) });
    }

    return Response.json({ answer: data.choices[0].message.content });

  } catch (e: any) {
    return Response.json({ answer: "Error: " + e.message });
  }
}
