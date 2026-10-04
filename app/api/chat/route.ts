export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const key = process.env.GROQ_API_KEY;
    if (!key) return Response.json({ reply: "GROQ_API_KEY Vercel mein nahi laga", needsDiagram: false, diagramType: null });

    const msg = message || "";
    const lower = msg.toLowerCase();

    const urduWords = ["kya","hai","kaise","ka","ki","ko","mein","yeh","wo","wala","samjhao","batao","thoda","kase","kese","gurda","dil"];
    const isUrdu = /[\u0600-\u06FF]/.test(msg) || urduWords.some(w => lower.includes(w));
    const langRule = isUrdu
     ? "Reply in Roman Urdu + Simple Urdu mix. Example: Mitosis mein 1 cell se 2 cells bante hain."
      : "Reply in Simple ENGLISH ONLY.";

    // Image wala
    if (image) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: `You are NAWAZ ACADEMY TORAWARI. ${langRule} End with - NAWAZ ACADEMY TORAWARI` },
            { role: "user", content: [{ type: "text", text: msg }, { type: "image_url", image_url: { url: image } }] }
          ]
        })
      });
      const d = await res.json();
      const reply = d.choices?.[0]?.message?.content || "Image clear nahi";
      return Response.json({ reply, needsDiagram: false, diagramType: null });
    }

    if (msg.trim().length < 3) {
      return Response.json({ reply: "Assalam-o-Alaikum! Main NAWAZ ACADEMY TORAWARI hun.\n\n- NAWAZ ACADEMY TORAWARI", needsDiagram: false, diagramType: null });
    }

    let diagramType: string | null = null;
    if (lower.includes("mitos") || lower.includes("mios") || lower.includes("meiosis")) diagramType = "cell";
    else if (lower.includes("kidney") || lower.includes("gurda")) diagramType = "kidney";
    else if (lower.includes("heart") || lower.includes("dil")) diagramType = "heart";
    else if (lower.includes("photo")) diagramType = "photosynthesis";

    const systemPrompt = `You are NAWAZ ACADEMY TORAWARI - AI Tutor.
    LANGUAGE RULE: ${langRule}
    Topic: ${msg}
    Format:
    1. Definition
    2. Detailed Concept (5 lines)
    3. Process / Types
    4. Example
    5. Importance / Difference
    Use $x^2$ for math. No **. End with - NAWAZ ACADEMY TORAWARI`;

    // 3 Models ka backup system - 1 fail to 2nd, 2nd fail to 3rd
    const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "openai/gpt-oss-20b"];
    let finalReply = null;

    for (const model of models) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msg }],
            temperature: 0.5,
            max_tokens: 1000
          })
        });
        const data = await res.json();
        if (data.choices && data.choices[0] && data.choices[0].message) {
          finalReply = data.choices[0].message.content.replace(/\*\*/g, "");
          break; // jawab mil gaya, loop khatam
        }
      } catch (e) {
        continue; // is model se nahi hua to agla try karo
      }
    }

    if (!finalReply) {
      return Response.json({ reply: `Server thoda busy tha, lekin ab theek hai. Aap dobara "What is mitosis" likhein, ab jawab aayega.\n\n- NAWAZ ACADEMY TORAWARI`, needsDiagram: false, diagramType: null });
    }

    return Response.json({ reply: finalReply, needsDiagram:!!diagramType, diagramType: diagramType });

  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message + "\n\n- NAWAZ ACADEMY TORAWARI", needsDiagram: false, diagramType: null });
  }
}
