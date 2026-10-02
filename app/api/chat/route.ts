export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({ answer: "API Key Vercel me set nahi hai" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Tum Nawaz Academy ke Expert Teacher ho. Jis zaban me sawal ho usi me jawab do. Sirf usi topic ka sahi, verified, to-the-point jawab do. 4-6 points me samjhao."
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.log("Groq Error:", data);
      return Response.json({ answer: "Groq Error: " + (data.error?.message || "Key invalid") });
    }

    return Response.json({ answer: data.choices[0].message.content });

  } catch (e: any) {
    return Response.json({ answer: "Server Error: " + e.message });
  }
}
