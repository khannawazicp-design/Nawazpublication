export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "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";
    let model = "openai/gpt-oss-120b";
    let content: any = message;
    if (image) {
      model = "meta-llama/llama-4-maverick-17b-128e-instruct";
      content = [
        { type: "text", text: message || "explain" },
        { type: "image_url", image_url: { url: image } }
      ];
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: 2500,
        messages: [
          {
            role: "system",
            content: "You are NawazAcademy AI Ustad. RULES: 1) NEVER use markdown symbols like **, ##, ###, ```, *, -. 2) Give clean plain simple text. 3) For headings just write normal line like 'Example:' not **Example**. 4) For matrix write simple like [ [a11, a12, a13], [a21, a22, a23] ]. 5) Always give detailed long answer with examples but in plain text."
          },
          { role: "user", content }
        ]
      }),
    });
    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || "";
    // Safety clean in backend also
    reply = reply.replace(/\*\*/g, "").replace(/###/g, "").replace(/##/g, "").replace(/```/g, "");
    return Response.json({ reply });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
