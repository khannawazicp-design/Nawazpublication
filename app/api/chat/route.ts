import { NextResponse } from "next/server";

const PRO_PROMPTS: any = {
  math: "You are a Math professor. Create 100% mathematically correct poster, show formula, step by step solution, clean white background, textbook style, no spelling mistake, 4k, ultra detailed: ",
  science: "You are a Science illustrator. Create highly accurate labeled scientific diagram poster, white background, professional, 4k: ",
  islamic: "You are Islamic designer. Create beautiful Islamic poster with 100% correct Arabic calligraphy, elegant pattern, 4k: ",
  business: "You are a top advertising designer. Create modern commercial advertisement poster, bold readable Urdu English text, luxury premium look, 4k: ",
  social: "You are viral social media designer. Create attractive YouTube thumbnail, bold 3D text, high contrast, 4k: ",
};

export async function POST(req: Request) {
  try {
    const { userPrompt, category } = await req.json();

    const basePrompt = PRO_PROMPTS[category] || PRO_PROMPTS.business;
    const finalPrompt = `${basePrompt} ${userPrompt}. Professional, 4k, HD, no watermark, no error, highly detailed`;

    // فری امیج API - اس میں کوئی Key نہیں چاہیے، اس لیے IP Error نہیں آئے گا
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true`;

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.log("Generate Error:", error);
    return NextResponse.json({ error: "Poster generation failed" }, { status: 500 });
  }
}
