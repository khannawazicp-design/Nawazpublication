export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    let model = "llama-3.1-8b-instant";
    let messages:any;

    if (image) {
      model = "meta-llama/llama-4-maverick-17b-128e-instruct";
      messages = [
        { role: "system", content: "You are NawazAcademy AI Ustad. Explain image in plain simple text. Never use **, ##, ```." },
        { role: "user", content: [
          { type: "text", text: message || "Is tasveer ko detail me samjhao" },
          { type: "image_url", image_url: { url: image } }
        ]}
      ];
    } else {
      messages = [
        { role: "system", content: "You are NawazAcademy AI Ustad. Give detailed answer in plain text. NEVER use **, ##, ```." },
        { role: "user", content: message }
      ];
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, max_tokens: 2000 })
    });

    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content || data.error?.message || "Jawab nahi mila";
    reply = reply.replace(/\*\*/g,"").replace(/##/g,"").replace(/```/g,"");
    return Response.json({ reply });
  } catch (e:any) { return Response.json({ reply: "Error: " + e.message }); }
}
