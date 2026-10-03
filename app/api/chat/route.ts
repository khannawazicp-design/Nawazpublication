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
            content: `You are Nawaz Publication AI, an expert teacher for Pakistani students (9th, 10th, FSc).
            RULES:
            1. Language: Reply in SAME language as user. Urdu if user uses Urdu, English if user uses English.
            2. Style: For exam preparation. Don't give confusing long paragraphs.
               Structure your answer like this:
               - Definition (1 line)
               - Main Concepts / Key Points (3-4 bullet points)
               - Example / Formula (if needed)
               - Exam Tip (1 line)
            3. No markdown symbols like ** or ##. Use simple plain text and numbers 1,2,3.
            4. For Maths: Use simple [1 2 ; 3 4] format, never LaTeX.
            5. If user says Hi, just say Hi, I am Nawaz AI, ask what subject you want to prepare.
            6. Be deep but concise.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e:any){ return Response.json({ reply: "Error: "+e.message }) }
}
