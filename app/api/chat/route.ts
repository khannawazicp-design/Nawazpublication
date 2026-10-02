export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return Response.json({ reply: "Vercel Settings me GROQ_API_KEY add karen" });

    let model = "llama3-8b-8192";
    let messages: any = [{ role: "system", content: "You are NawazAcademy AI Ustad. Answer any question - daily life, study, any topic. No LaTeX. For matrix write simple like [ [a,b],[c,d] ]. Use Roman Urdu if user uses Urdu." }];

    if (image) {
      model = "llama-3.2-11b-vision-preview";
      messages.push({ role: "user", content: [{ type: "text", text: message || "Is tasveer me kya hai? Explain karen" }, { type: "image_url", image_url: { url: image } }] });
    } else {
      messages.push({ role: "user", content: message });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, temperature: 0.4 }),
    });

    const data = await response.json();
    return Response.json({ reply: data?.choices?.[0]?.message?.content || "Jawab nahi mila" });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
