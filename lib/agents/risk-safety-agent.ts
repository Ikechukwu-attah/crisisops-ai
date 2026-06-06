import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, RISK_SAFETY_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import { RiskSafetySchema, type RiskSafetyOutput } from "@/lib/validation/schemas";

interface RiskSafetyInput {
  allAgentOutputs: Record<string, unknown>;
}

export async function runRiskSafetyAgent(input: RiskSafetyInput): Promise<{
  success: boolean;
  data: RiskSafetyOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(RISK_SAFETY_PROMPT, {
    allAgentOutputs: JSON.stringify(input.allAgentOutputs, null, 2),
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "risk-safety-agent");
    const parsed = RiskSafetySchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "risk-safety-repair");
    const reparsed = RiskSafetySchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
