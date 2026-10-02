export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "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";

    // FINAL WORKING MODELS FOR 2026
    let model = "openai/gpt-oss-20b";
    let content: any = message;

    if (image) {
      model = "qwen/qwen3-32b";
      content = [
        { type: "text", text: message || "explain this image" },
        { type: "image_url", image_url: { url: image } }
      ];
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are NawazAcademy AI Ustad. Simple answer." },
          { role: "user", content }
        ]
      }),
    });

    const data = await response.json();
    if (data.error) return Response.json({ reply: "Groq: " + data.error.message });
    return Response.json({ reply: data?.choices?.[0]?.message?.content });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
