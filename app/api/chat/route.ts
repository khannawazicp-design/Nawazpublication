export async function POST(req: Request) {
  try {
    const { message, image } = await req.json();
    const key = process.env.GROQ_API_KEY;
    if (!key) return Response.json({ reply: "API Key missing", needsDiagram: false, diagramType: null });

    const msg = (message || "").toLowerCase();

    // Urdu detection - Roman Urdu + Urdu script
    const urduWords = ["kya","hai","kaise","ka","ki","ko","mein","yeh","wo","wala","wali","samjhao","batao","thoda","achha","gurda","dil"];
    const isUrdu = /[\u0600-\u06FF]/.test(message) || urduWords.some(w => msg.includes(w));
    const langRule = isUrdu
     ? "Reply in Roman Urdu + Simple Urdu mix (e.g., Gurda khoon ko saaf karta hai). Use Roman Urdu, not pure English."
      : "Reply in Simple ENGLISH ONLY.";

    // Image handle
    if (image) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: `You are NAWAZ ACADEMY TORAWARI. ${langRule} End with - NAWAZ ACADEMY TORAWARI` },
            { role: "user", content: [{ type: "text", text: message }, { type: "image_url", image_url: { url: image } }] }
          ]
        })
      });
      const d = await res.json();
      const reply = d.choices?.[0]?.message?.content || "Image clear nahi";
      return Response.json({ reply, needsDiagram: false, diagramType: null });
    }

    if (msg.length < 4) {
      return Response.json({ reply: "Salam! Main NAWAZ ACADEMY TORAWARI hun. Sawal poochein.\n\n- NAWAZ ACADEMY TORAWARI", needsDiagram: false, diagramType: null });
    }

    // Diagram type auto detect
    let diagramType: string | null = null;
    if (msg.includes("kidney") || msg.includes("gurda") || msg.includes("kindny")) diagramType = "kidney";
    else if (msg.includes("photo")) diagramType = "photosynthesis";
    else if (msg.includes("heart") || msg.includes("dil")) diagramType = "heart";
    else if (msg.includes("cell")) diagramType = "cell";
    else if (msg.includes("water") || msg.includes("cycle")) diagramType = "watercycle";

    const systemPrompt = `You are NAWAZ ACADEMY TORAWARI. ${langRule}
    Topic: ${message}
    Give detailed answer:
    1. Definition
    2. Detailed Concept (4-5 lines)
    3. Process / Formula with LaTeX $x^2$ if needed
    4. Example
    5. Importance
    No **. End with - NAWAZ ACADEMY TORAWARI`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
      })
    });

    const data = await res.json();
    if (!data.choices ||!data.choices[0]) {
      return Response.json({ reply: "AI busy hai, dobara try karein.\n\n- NAWAZ ACADEMY TORAWARI", needsDiagram: false, diagramType: null });
    }

    return Response.json({ reply: data.choices[0].message.content.replace(/\*\*/g,""), needsDiagram:!!diagramType, diagramType });

  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramType: null });
  }
}
