import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, COMMUNICATIONS_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import {
  CommunicationsSchema,
  type CommunicationsOutput,
  type TriageOutput,
  type VerificationOutput,
  type ResourcePlannerOutput,
} from "@/lib/validation/schemas";

interface CommunicationsInput {
  triageOutput: TriageOutput;
  verificationOutput: VerificationOutput;
  resourcePlan: ResourcePlannerOutput;
}

export async function runCommunicationsAgent(input: CommunicationsInput): Promise<{
  success: boolean;
  data: CommunicationsOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(COMMUNICATIONS_PROMPT, {
    triageOutput: JSON.stringify(input.triageOutput, null, 2),
    verificationOutput: JSON.stringify(input.verificationOutput, null, 2),
    resourcePlan: JSON.stringify(input.resourcePlan, null, 2),
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "communications-agent");
    const parsed = CommunicationsSchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "communications-repair");
    const reparsed = CommunicationsSchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
