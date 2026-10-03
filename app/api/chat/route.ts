export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: `You are Nawaz Academy AI.
            RULES - Follow strictly:
            1. Reply in the SAME language as the user. If user writes English, reply in English. If user writes Urdu, reply in Urdu.
            2. NEVER use **, ##, *, or any markdown symbols. Plain simple text only.
            3. If user says Hi / Hello, just say "Hi! How can I help you today?" Don't mention Matrix or any subject yourself.
            4. For Maths, never use latex like \\( \\). Use simple plain text like [1 2 ; 3 4].
            5. Keep answer clean, short and professional.`
          },
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e:any){ return Response.json({ reply: "Error: "+e.message }) }
}
