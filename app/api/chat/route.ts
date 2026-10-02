export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "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";
    let model = "llama-3.1-8b-instant";
    let messages: any = [{ role: "system", content: "You are NawazAcademy AI Ustad." }];
    if (image) {
      model = "llama-3.2-11b-vision-preview";
      messages.push({ role: "user", content: [{ type: "text", text: message || "explain" }, { type: "image_url", image_url: { url: image } }] });
    } else {
      messages.push({ role: "user", content: message });
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages }),
    });
    const data = await response.json();
    return Response.json({ reply: data?.choices?.[0]?.message?.content || JSON.stringify(data) });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
