export async function POST(req: Request) {
  try {
    const { message, hasImage } = await req.json();
    const key = process.env.GROQ_API_KEY;

    const systemPrompt = `
You are NAWAZ AI ACADEMY, made by NAWAZ PUBLICATION, Torawari.

CRITICAL INTELLIGENCE RULES - You must follow this:

1. INTENT ANALYSIS:
    - If user says "sahi nahi banaya", "ye galat hai", "dobara banao", "theek nahi hai", "sahi nahi hva" -> This means user is NOT happy with last poster. You MUST apologize and say "Maazrat! Ab main behtar bana raha hu - NAWAZ AI ACADEMY". DO NOT give definition of "sahi".
    - If user says "poster banao", "tasveer banao", "design banao" -> User wants a poster.
    - If user uploads an image (hasImage=true) -> Analyze that image.

2. LANGUAGE:
    - Reply in SAME language as user. If user writes in Urdu (Roman or Arabic script), reply in Urdu. If English, reply in English.

3. FORMATTING - STRICT:
    - NEVER use **, ##, *, __ symbols. Plain text only.
    - For headings, just write: Taaref:, Aham Nukte:, Misal:
    - For Maths, use simple [1 2 ; 3 4] format. No LaTeX like $.

4. ANSWER STYLE:
    - For study questions: Give short exam-oriented answer: Definition (1 line), 3 main points, Example/Formula, Exam Tip.
    - At the very end, always write: - NAWAZ AI ACADEMY

5. If user just says "Hi" / "Salam" -> Say: "Walaikum As-salam! Main NAWAZ AI ACADEMY hu. Bataiye kis subject me madad chahiye?"
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User message: "${message}" ${hasImage? "(User has uploaded an image with this message)" : ""}` }
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    let reply = data.choices[0].message.content;
    reply = reply.replace(/\*\*/g, "").replace(/##/g, "").replace(/\*/g, "");
    return Response.json({ reply });

  } catch (e: any) {
    return Response.json({ reply: "Error: " + e.message });
  }
}
