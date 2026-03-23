import { NextResponse } from 'next/server';
import { parseIntent } from '@/lib/engine/intent';
import { retrieveMemory } from '@/lib/engine/memory';
import { generatePlan } from '@/lib/engine/planning';
import { executePlan } from '@/lib/engine/execution';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  try {
    const { input, context, userId = 'anonymous' } = await request.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required." }, { status: 400, headers: CORS_HEADERS });
    }

    // Pipeline Step 1: Intent
    const intent = await parseIntent(input, context);

    // Pipeline Step 2: Memory
    const memory = await retrieveMemory(userId, intent.intent);

    // Pipeline Step 3: Plan
    const plan = await generatePlan(intent, memory);

    // Pipeline Step 4: Execute
    const executionResult = await executePlan(plan, { input, context, memory });

    // Return the response (actions to be taken by the extension/frontend)
    return NextResponse.json({
        success: true,
        intent,
        plan,
        data: executionResult
    }, { headers: CORS_HEADERS });
    
  } catch (error: any) {
    console.error("Orchestrator error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: CORS_HEADERS });
  }
}
