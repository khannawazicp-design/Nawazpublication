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
          { role: "system", content: "You are Nawaz Academy AI. RULE: Never use LaTeX like \\( \\), \\[ \\], \\begin{bmatrix}. Always explain Matrix in simple text table format like [ 1 2 ; 3 4 ]. Use simple Urdu + English, give examples, easy for 9th/10th students." },
          { role: "user", content: message }
        ]
      })
    });
    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (e:any){ return Response.json({ reply: "Error: "+e.message }) }
}
