import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    if (!context || !context.bodySnippet) {
       return NextResponse.json({ suggestion: null }, { headers: CORS_HEADERS });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing");

    // We keep the prompt highly strict to only return a suggestion if it's HIGHLY relevant.
    const prompt = `You are the Proactive Subconscious of NeuroFlow AI.
Analyze the following webpage context. If the user is looking at something that requires an obvious, helpful action (like an unread email, a LinkedIn message, a GitHub PR, or a job application), generate a single, highly concise, 3-7 word actionable suggestion (e.g., "Draft a polite decline", "Summarize this Pull Request", "Accept connection request").
If the page is generic (like a Google search home page, a news article, or empty dashboard), return exactly "NULL". Do not invent actions for generic pages.

Context URL: ${context.url}
Context Snippet: ${context.bodySnippet?.substring(0, 1500)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      })
    });

    const resultData = await response.json();
    let responseText = resultData.candidates?.[0]?.content?.parts?.[0]?.text || 'NULL';
    responseText = responseText.trim().replace(/^["']|["']$/g, '');

    if (responseText === 'NULL' || responseText.length > 50 || responseText.toLowerCase() === 'null') {
         return NextResponse.json({ suggestion: null }, { headers: CORS_HEADERS });
    }

    return NextResponse.json({ suggestion: responseText }, { headers: CORS_HEADERS });
    
  } catch (error: any) {
    console.error("Proactive AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
