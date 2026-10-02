export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    let model = "openai/gpt-oss-120b";
    let messages:any;

    if (image) {
      model = "meta-llama/llama-4-maverick-17b-128e-instruct";
      messages = [
        { role: "system", content: "You are NawazAcademy AI Ustad. When user sends image, read text in image and solve it step by step in plain simple language. NEVER use **, ##, ###, ```, *, -. Just clean paragraphs." },
        { role: "user", content: [
          { type: "text", text: message || "اس تصویر میں جو سوال ہے اس کو تفصیل سے حل کرو" },
          { type: "image_url", image_url: { url: image } }
        ]}
      ];
    } else {
      messages = [
        { role: "system", content: "You are NawazAcademy AI Ustad. Give detailed long answer in plain text. NEVER use **, ##, ###, ```, *, -. Just clean text with headings like Definition:, Example: etc." },
        { role: "user", content: message }
      ];
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, max_tokens: 2500 })
    });

    const data = await res.json();
    if(data.error) return Response.json({ reply: "Error: " + data.error.message });
    let reply = data.choices?.[0]?.message?.content || "";
    reply = reply.replace(/\*\*/g,"").replace(/##/g,"").replace(/```/g,"");
    return Response.json({ reply });
  } catch (e:any) { return Response.json({ reply: "Error: " + e.message }); }
}
