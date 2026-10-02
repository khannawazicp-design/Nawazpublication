const apiKey = "AAPKI_NAYI_GROQ_KEY_YAHAN"; // yahan wahi key jo ab chal rahi hai

export async function POST(req: Request) {
  const { message } = await req.json();

  // Language detect
  const isUrdu = /[\u0600-\u06FF]/.test(message);

  const systemPrompt = `
  You are "AI Ustad" - Pakistan's most helpful AI.
    - If user writes in Urdu, reply in beautiful Urdu.
    - If user writes in English, reply in professional English.
    - You can do: Notes, Posters, Research, Video Scripts, Business Ideas.
    - Always reply in a professional, clean format like ChatGPT with headings and points.
    - Keep tone respectful and "Ustad" style.
  `;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return Response.json({ reply: data.choices?.[0]?.message?.content || "Ustad hazir hai, dobara puchen." });
}
