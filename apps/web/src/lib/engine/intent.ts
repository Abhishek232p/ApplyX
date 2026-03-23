export interface IntentResult {
  intent: string;
  action: string;
  target?: string;
  generated_text?: string;
  context: any;
  priority: string;
}

export async function parseIntent(input: string, context?: any): Promise<IntentResult> {
  console.log("=== API ROUTE: PARSING INTENT VIA REST ===");
  try {
    const prompt = `You are the Intent Engine for NeuroFlow AI.
Analyze the user input and determine what text needs to be generated or what action needs to be taken.
Return a JSON object exactly matching this schema:
{
  "intent": "Brief description of the intent",
  "action": "Specific action (e.g., 'insert_text', 'chat')",
  "generated_text": "The actual final text, email draft, or answer to the question",
  "context": {},
  "priority": "high|medium|low"
}

Context: ${JSON.stringify(context || {})}
User Input: ${input}`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined.");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }

    const resultData = await response.json();
    const responseText = resultData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Strip markdown JSON wrapping if Gemini unexpectedly includes it
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const jsonResult = JSON.parse(cleanText);
    return jsonResult as IntentResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to process intent with Gemini: " + (error.message || "Unknown error"));
  }
}
