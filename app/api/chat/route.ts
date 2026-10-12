import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userPrompt, category } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt خالی ہے" }, { status: 400 });
    }

    // اگر API Key نہیں ہے تو ڈیمو امیج دے دو تاکہ سائٹ Crash نہ ہو
    if (!process.env.STABILITY_API_KEY) {
      console.log("API Key missing, returning demo");
      return NextResponse.json({ 
        imageUrl: `https://via.placeholder.com/1024x1024.png?text=${encodeURIComponent(userPrompt)}`,
        demo: true 
      });
    }

    const finalPrompt = `Professional poster for ${category}: ${userPrompt}, 4k, HD, no spelling mistake, academic style`;

    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({ prompt: finalPrompt } as any)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Image API Error");
    }

    return NextResponse.json({ imageUrl: data.image });

  } catch (error: any) {
    console.error(error);
    // یہاں Crash ہونے کے بجائے Error واپس بھیجے گا
    return NextResponse.json({ error: error.message, imageUrl: "" }, { status: 500 });
  }
}
