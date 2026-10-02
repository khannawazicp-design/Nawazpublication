export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "gsk_YAHAN_APNI_NAYI_KEY_LIKHEN";

    const isUrdu = /[\u0600-\u06FF]/.test(message);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `You are AI Ustad - An expert for NawazAcademy.
            Rule: If user writes in Urdu script, reply in Urdu. If English, reply in English.
            Be professional like ChatGPT, use headings, bullet points.
            You can do: Notes, Poster text, Research, Video scripts for any person, not just students.`
          },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ reply: `Groq Error: ${data.error?.message}` });
    }

    return Response.json({ reply: data.choices[0].message.content });

  } catch (e: any) {
    return Response.json({ reply: "Server Error: " + e.message });
  }
}
