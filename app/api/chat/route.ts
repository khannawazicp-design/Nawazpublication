export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({ reply: "Vercel me GROQ_API_KEY lagi hi nahi hai! Settings > Env Vars check karo" });
    }

    let model = "llama-3.1-8b-instant";
    let messages:any = [
      { role: "system", content: "You are NawazAcademy AI. Plain text only." },
      { role: "user", content: message || "hi" }
    ];

    if(image){
      model = "meta-llama/llama-4-maverick-17b-128e-instruct";
      messages = [
        { role: "system", content: "Explain image in plain text." },
        { role: "user", content: [{type:"text", text: message}, {type:"image_url", image_url:{url:image}}] }
      ];
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, max_tokens: 1000 })
    });

    const data = await res.json();
    if (data.error) {
      // Ye batayega kaunsi key use ho rahi hai
      return Response.json({ reply: `Groq Error: ${data.error.message} | Key jo Vercel use kar raha hai uske akhri 4 harf:...${apiKey.slice(-4)}` });
    }

    let reply = data.choices?.[0]?.message?.content || "No reply";
    return Response.json({ reply });
  } catch (e:any) { return Response.json({ reply: "Code Error: " + e.message }); }
}
