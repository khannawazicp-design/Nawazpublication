export async function POST(req: Request) {
  const { message } = await req.json();
  const key = process.env.OPENAI_API_KEY;

  // Agar real key nahi hai to bina key ke hi explain karo
  if (!key || key.includes("dummy")) {
    return Response.json({
      reply: `**${message}** ka Topic:

1. **Definition:** Ye ${message} ka important chapter hai.
2. **Main Points:** Isme formulas, diagrams aur examples shamil hain.
3. **Exam Tip:** Is topic se har saal 5-10 marks ka sawal aata hai.
4. **Nawaz Notes:** Hamare notes me ye topic Urdu, English aur Pashto teeno me to-the-point samjhaya gaya hai.

Mazeed detail ke liye WhatsApp par rabta karen.`
    });
  }

  // Agar real OpenAI key hai to ChatGPT se jawab lo
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Explain ${message} in simple Urdu + English for 9th-12th students, to-the-point` }],
    }),
  });
  const data = await res.json();
  return Response.json({ reply: data.choices?.[0]?.message?.content || "Error" });
}
