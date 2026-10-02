export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY || "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";

    let model = "openai/gpt-oss-120b"; // ye bara model hai, detailed jawab dega
    let content: any = message;

    if (image) {
      model = "qwen/qwen3-32b";
      content = [
        { type: "text", text: message || "Is ko detail me explain karo" },
        { type: "image_url", image_url: { url: image } }
      ];
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content: "You are NawazAcademy AI Ustad, a top teacher. Give DETAILED, LONG, easy explanation in the same language user asks. Use headings, examples, formulas. If user asks What is matrix, explain definition, order, types, examples, uses. Never use LaTeX like \\begin. Write matrix like [ [1,2],[3,4] ]. Always detailed answer, not 2 lines."
          },
          { role: "user", content }
        ]
      }),
    });

    const data = await response.json();
    return Response.json({ reply: data?.choices?.[0]?.message?.content });
  } catch (e: any) { return Response.json({ reply: "Error: " + e.message }); }
}
