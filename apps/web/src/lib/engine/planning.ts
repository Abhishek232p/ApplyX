import { IntentResult } from './intent';

export async function generatePlan(intent: IntentResult, memory: any) {
  console.log("Generating plan for intent:", intent.action);
  
  if (intent.tasks && intent.tasks.length > 0) {
      return ["execute_n8n"];
  }

  // For Wispr Flow style magic, almost everything resolves to streaming output
  if (intent.action === "chat" || intent.action === "insert_text") {
     return ["stream_output"];
  }

  return ["fallback_action"];
}
