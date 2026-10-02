export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    // Fallback key for now, will work even if Vercel env missing
    const apiKey = process.env.GROQ_API_KEY || "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";

    let model = "llama3-8b-8192";
    let messages: any = [{ role: "system", content: "You are NawazAcademy AI Ustad. Answer in simple text. Never use LaTeX like \\begin, \\end. For matrix write like [ [a,b],[c,d] ]." }];

    if (image) {
      model = "llama-3.2-11b-vision-preview";
      messages.push({ role: "user", content: [{ type: "text", text: message || "Is tasveer ki wazahat karen" }, { type: "image_url", image_url: { url: image } }] });
    } else {
      messages.push({ role: "user", content: message });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, temperature: 0.4 }),
    });

    const data = await response.json();
    if (data.error) return Response.json({ reply: "Groq Error: " + data.error.message });
    return Response.json({ reply: data?.choices?.[0]?.message?.content || "Jawab nahi mila" });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
