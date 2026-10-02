export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "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";

    // NEW MODELS 2026
    let model = "llama-3.1-8b-instant";
    let messages: any = [{ role: "system", content: "You are NawazAcademy AI Ustad. Simple plain text. No LaTeX like \\begin." }];

    if (image) {
      model = "llama-3.2-11b-vision-preview";
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "Is tasveer ki wazahat karen" },
          { type: "image_url", image_url: { url: image } }
        ]
      });
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
