import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, DECISION_SUMMARY_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import { DecisionSummarySchema, type DecisionSummaryOutput } from "@/lib/validation/schemas";

interface DecisionSummaryInput {
  allAgentOutputs: Record<string, unknown>;
}

export async function runDecisionSummaryAgent(input: DecisionSummaryInput): Promise<{
  success: boolean;
  data: DecisionSummaryOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(DECISION_SUMMARY_PROMPT, {
    allAgentOutputs: JSON.stringify(input.allAgentOutputs, null, 2),
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "decision-summary-agent");
    const parsed = DecisionSummarySchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "decision-summary-repair");
    const reparsed = DecisionSummarySchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
