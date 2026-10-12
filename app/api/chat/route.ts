
import { NextResponse } from "next/server";

const PRO_PROMPTS: Record<string, string> = {
  math:
    "Educational mathematics poster, clear formulas, correct step-by-step layout, textbook style, clean white background. Treat mathematical accuracy as essential: ",
  science:
    "Professional educational science illustration, clear scientific diagram, uncluttered white background, readable labels where possible: ",
  islamic:
    "Elegant Islamic educational poster, respectful design, beautiful geometric patterns. Do not invent Quranic verses or Hadith: ",
  business:
    "Modern professional advertisement poster, premium composition, clear space for readable Urdu or English text: ",
  social:
    "Eye-catching social media thumbnail, strong visual hierarchy, bold composition, high contrast: ",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userPrompt = body.userPrompt;
    const category = body.category;

    if (
      typeof userPrompt !== "string" ||
      !userPrompt.trim() ||
      userPrompt.length > 1500
    ) {
      return NextResponse.json(
        { error: "براہ کرم درست ہدایات لکھیں (زیادہ سے زیادہ 1500 حروف)" },
        { status: 400 }
      );
    }

    if (
      typeof category !== "string" ||
      !Object.prototype.hasOwnProperty.call(PRO_PROMPTS, category)
    ) {
      return NextResponse.json(
        { error: "پوسٹر کی قسم درست نہیں ہے" },
        { status: 400 }
      );
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Image API key server پر configure نہیں ہے" },
        { status: 500 }
      );
    }

    const finalPrompt =
      `${PRO_PROMPTS[category]} ${userPrompt.trim()}. ` +
      "Professional educational design, balanced composition, high detail.";

    const url =
      `https://gen.pollinations.ai/image/${encodeURIComponent(finalPrompt)}` +
      `?model=flux&width=1024&height=1024&nologo=true`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(120000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Image provider status:", response.status);
      return NextResponse.json(
        { error: "تصویر نہیں بن سکی۔ کچھ دیر بعد دوبارہ کوشش کریں۔" },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Image service نے درست تصویر واپس نہیں کی" },
        { status: 502 }
      );
    }

    const bytes = await response.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const imageUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Generate Error:", error);

    return NextResponse.json(
      { error: "درخواست مکمل نہیں ہو سکی۔ دوبارہ کوشش کریں۔" },
      { status: 500 }
    );
  }
}
