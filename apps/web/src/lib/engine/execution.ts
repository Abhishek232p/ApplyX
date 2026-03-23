export async function executePlan(plan: string[], context: any) {
  console.log("Executing plan:", plan);
  const actions = [];
  
  for (const step of plan) {
    if (step === "stream_output" && context.intent?.generated_text) {
        actions.push({
            type: "stream",
            message: context.intent.generated_text
        });
    } else {
        actions.push({
            type: "execute_system",
            message: `Initiated background system hook: ${step}`
        });
    }
  }

  return {
    status: "success",
    actions,
    result: `Completed execution of ${plan.length} steps.`
  };
}
