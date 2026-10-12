import { NextResponse } from "next/server";

const PRO_PROMPTS: any = {
  math: `You are a world-class Mathematics professor and graphic designer. TASK: Create a 100% mathematically correct educational poster. RULES: 1. Verify the mathematical statement first. If user input is wrong, correct it. 2. Show Statement, Formula, Step-by-Step Solution. 3. No spelling mistakes. 4. Design: Academic, clean white background, black and blue text, with a clear graph/diagram. 4K resolution, professional textbook style. User Topic:`,
  science: `You are a Science textbook illustrator. TASK: Create a highly accurate, labeled scientific diagram poster. RULES: 1. Labels must be 100% correct. 2. White background, professional colors, arrows clear. 3. Suitable for school and college books. 4K, ultra detailed. User Topic:`,
  business: `You are a professional advertising designer from Canva Pro and Adobe. TASK: Create a modern, eye-catching, commercial advertisement poster. RULES: 1. Bold, readable Urdu and English text. 2. Premium colors, luxury look. 3. No spelling mistake in Urdu. 4. Looks like made by top agency. User Topic:`,
  islamic: `You are an Islamic calligraphy and poster designer. TASK: Create a beautiful Islamic poster. RULES: 1. Arabic text 100% correct with Tashkeel. 2. Elegant Islamic pattern, mosque background. 3. Respectful and spiritual design. User Topic:`,
  social: `You are a viral social media designer. TASK: Create a YouTube thumbnail / Instagram post. RULES: 1. Bold, catchy, 3D text. 2. High contrast, attractive. 3. Modern Gen-Z style. User Topic:`
};

export async function POST(req: Request) {
  const { userPrompt, category } = await req.json();
  const finalPrompt = `${PRO_PROMPTS[category]} ${userPrompt} -- Poster must be 4k, HD, professional, no watermark, no error`;

  // یہاں آپ اپنا Image API لگائیں - Best for Urdu is Flux or Imagen 3
  const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: finalPrompt, output_format: "png" })
  });

  const data = await response.json();
  // آپ کے API کے حساب سے یہاں image URL آئے گا
  return NextResponse.json({ imageUrl: data.image });
}
