import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getAIResponse(query: string, userPoints: number) {
  const systemPrompt = `
  You are NawazPublication AI Tutor.
  AUTO LANGUAGE RULE: Detect user language from query.
    - If English -> Reply in English
    - If Urdu (اردو) -> Reply in Urdu script
    - If Pashto -> Reply in Pashto
    - If Roman Urdu -> Reply in Roman Urdu
    - If Arabic -> Reply in Arabic
  Keep answers simple, point-wise. Provide MCQs, Short Q/A if asked.
  User Points: ${userPoints}. If low, give shorter answer.
  `;
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{role:"system", content: systemPrompt}, {role:"user", content: query}]
  });
  return res.choices[0].message.content;
}
