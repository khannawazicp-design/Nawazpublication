export async function POST(req: Request) {
  const { question } = await req.json();
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: `Tum Nawaz Academy ke Expert Teacher ho. RULES: 1. Jis zaban me sawal usi me jawab do. 2. Sirf usi topic ka jawab do jis ka sawal ho. 3. Jawab 4-6 conceptual points me do, faltu kahani nahi. 4. Sahi aur verified jawab do, ghalat kabhi mat do.` },
        { role: "user", content: question }
      ]
    })
  });
  const data = await response.json();
  return Response.json({ answer: data.choices?.[0]?.message?.content || "Jawab nahi mila" });
}
