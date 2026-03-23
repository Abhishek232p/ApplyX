export interface IntentTask {
  type: string;
  to?: string;
  subject?: string;
  body?: string;
  [key: string]: any;
}

export interface IntentResult {
  intent: string;
  action: string;
  target?: string;
  generated_text?: string;
  context: any;
  priority: string;
  tasks?: IntentTask[];
}

export async function parseIntent(input: string, context?: any, memory?: any): Promise<IntentResult> {
  console.log("=== API ROUTE: PARSING INTENT VIA REST ===");
  try {
    const memoryRules = memory?.preferences?.length > 0 
      ? `\nCRITICAL SYSTEM RULES FROM USER MEMORY:\n- ${memory.preferences.join('\n- ')}` 
      : '';

    const prompt = `You are the Intent Engine for NeuroFlow AI.
Analyze the user input and determine what text needs to be generated or what action needs to be taken. If the user asks to send an email, update CRM, or trigger a multi-app workflow, format it in the tasks array.
Return a JSON object exactly matching this schema:
{
  "intent": "Brief description of the intent",
  "action": "Specific action (e.g., 'send_email', 'insert_text', 'chat', 'update_preference')",
  "generated_text": "The final text, email draft, or answer",
  "context": {},
  "priority": "high|medium|low",
  "tasks": [
    {
      "type": "gmail.send",
      "to": "investor@example.com",
      "subject": "Weekly Update",
      "body": "Hello..."
    }
  ]
}

Context Elements: ${JSON.stringify(context || {})} ${memoryRules}
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
