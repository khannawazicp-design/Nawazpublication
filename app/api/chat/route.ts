export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, image } = body;
    const lower = (message || "").toLowerCase().trim();
    const key = process.env.GROQ_API_KEY;

    if (image) {
      const visionRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: [
            { role: "system", content: "You are NAWAZ ACADEMY TORAWARI. User uploaded an image. Explain image in detail in simple Urdu/English. Give Definition, Labeled Parts, Process, Example. End with - NAWAZ ACADEMY TORAWARI. No **" },
            { role: "user", content: [
              { type: "text", text: message || "Is tasveer ko detail se samjhao" },
              { type: "image_url", image_url: { url: image } }
            ]}
          ]
        })
      });
      const visionData = await visionRes.json();
      const reply = visionData.choices?.[0]?.message?.content?.replace(/\*\*/g, "") || "Tasveer clear nahi hai";
      return Response.json({ reply, needsDiagram: false, diagramType: null });
    }

    if (["hi","hello","salam","hey","aoa","thanks","ok","bye"].includes(lower) || lower.length <= 3) {
      return Response.json({
        reply: `السلام علیکم! میں NAWAZ ACADEMY TORAWARI ہوں۔\nآپ سوال لکھیں، بول کر پوچھیں یا کتاب کی تصویر بھیجیں، میں تفصیل سے سمجھا دوں گا۔\n\n- NAWAZ ACADEMY TORAWARI`,
        needsDiagram: false, diagramType: null
      });
    }

    const needsDiagram = ["photosynthesis","heart","cell","water","dna","atom","brain","plant","kidney","lungs","diagram","structure","cycle"].some(w => lower.includes(w));

    const systemPrompt = `You are NAWAZ ACADEMY TORAWARI. Explain topic: ${message}
    Format in Urdu+English simple:
    1. Definition (تعریف) - 2 lines
    2. Tafseeli Tasawur (تفصیلی تصور) - 5-6 lines step by step
    3. Ahem Hisse / Process - Numbered points
    4. Diagram ki Wazahat - What diagram shows
    5. Rozmarra ki Misaal
    6. Ahmiyat
    No **. End with - NAWAZ ACADEMY TORAWARI`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
      })
    });
    const data = await res.json();
    const reply = data.choices[0].message.content.replace(/\*\*/g, "");
    return Response.json({ reply, needsDiagram, diagramType: message });
  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message, needsDiagram: false, diagramType: null });
  }
}
