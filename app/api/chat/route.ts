export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, image } = body;
    const key = process.env.GROQ_API_KEY;
    const msg = message || "";

    // ---- زبان کا صحیح پتہ لگانے والا سسٹم ----
    const hasUrduScript = /[\u0600-\u06FF]/.test(msg);
    const romanUrduWords = ["kya","hai","hain","kaise","ka","ki","ko","mein","main","yeh","wo","kaisa","tarah","samjhao","batao","kis","kyu","kyun","wala","wali","kro","karo"];
    const lower = msg.toLowerCase();
    const hasRomanUrdu = romanUrduWords.some(w => lower.includes(w));

    let langInstruction = "";
    if (hasUrduScript || hasRomanUrdu) {
      langInstruction = "Reply in Urdu + English mix (Roman Urdu), simple for class 9-10 student. Use Urdu script if user used Urdu script, otherwise use Roman Urdu.";
    } else {
      langInstruction = "Reply in ENGLISH ONLY, simple English.";
    }

    if (image) {
      const visionRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: `You are NAWAZ ACADEMY TORAWARI. ${langInstruction}. Explain image in detail. End with - NAWAZ ACADEMY TORAWARI` },
            { role: "user", content: [
              { type: "text", text: msg },
              { type: "image_url", image_url: { url: image } }
            ]}
          ]
        })
      });
      const visionData = await visionRes.json();
      const reply = visionData.choices?.[0]?.message?.content?.replace(/\*\*/g, "") || "Image clear nahi";
      return Response.json({ reply, needsDiagram: false, diagramPrompt: null });
    }

    if (["hi","hello","salam","hey","aoa","thanks","ok","bye"].includes(lower.trim()) || msg.trim().length < 4) {
      return Response.json({
        reply: `السلام علیکم! میں NAWAZ ACADEMY TORAWARI ہوں۔\nآپ اردو یا انگلش میں سوال پوچھ سکتے ہیں۔\n\n- NAWAZ ACADEMY TORAWARI`,
        needsDiagram: false, diagramPrompt: null
      });
    }

    const systemPrompt = `
    You are NAWAZ ACADEMY TORAWARI.
    LANGUAGE RULE (VERY IMPORTANT): ${langInstruction}
    User wrote: "${msg}"
    If user wrote Urdu or Roman Urdu (kya, hai, kaise), you MUST reply in Urdu/Roman Urdu mix.
    If user wrote pure English, reply in English only.

    Give answer in this format:
    1. Definition
    2. Tafseeli Tasawur (5-6 lines)
    3. Process / Formula (Use $...$ for math)
    4. Example
    5. Importance

    Also decide if diagram needed. If science structure (kidney, heart, cell etc) then needsDiagram=true and give english prompt like "labeled diagram of human kidney".
    Return ONLY JSON: {"reply": "...", "needsDiagram": true/false, "diagramPrompt": "... or null"}
    `;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: msg }]
      })
    });
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    parsed.reply = parsed.reply.replace(/\*\*/g, "");
    return Response.json(parsed);

  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramPrompt: null });
  }
}
