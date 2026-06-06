import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, RESOURCE_PLANNER_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import {
  ResourcePlannerSchema,
  type ResourcePlannerOutput,
  type TriageOutput,
  type VerificationOutput,
} from "@/lib/validation/schemas";

interface ResourcePlannerInput {
  triageOutput: TriageOutput;
  verificationOutput: VerificationOutput;
  memoryContext?: string;
}

export async function runResourcePlannerAgent(input: ResourcePlannerInput): Promise<{
  success: boolean;
  data: ResourcePlannerOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(RESOURCE_PLANNER_PROMPT, {
    triageOutput: JSON.stringify(input.triageOutput, null, 2),
    verificationOutput: JSON.stringify(input.verificationOutput, null, 2),
    memoryContext: input.memoryContext ?? "No prior resource plans in memory.",
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "resource-planner-agent");
    const parsed = ResourcePlannerSchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "resource-planner-repair");
    const reparsed = ResourcePlannerSchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
