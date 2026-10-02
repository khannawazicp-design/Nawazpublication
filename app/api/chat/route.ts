export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are AI Ustad. STRICT RULE: Never use LaTeX. Never write \\begin, \\end, \\bmatrix, \\dots, a_{11}. For matrix always write in plain text like: A = [ [a11, a12, a1n], [a21, a22, a2n], [am1, am2, amn] ]. Use ... for dots. Write m x n for m times n. Keep it simple readable for college students." },
          { role: "user", content: message }
        ],
        temperature: 0.3
      }),
    });
    const data = await res.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e: any) { return Response.json({ reply: "Error" }); }
}
