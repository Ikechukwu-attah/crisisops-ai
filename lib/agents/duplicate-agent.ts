import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, DUPLICATE_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import { DuplicateSchema, type DuplicateOutput, type TriageOutput } from "@/lib/validation/schemas";

interface DuplicateInput {
  triageOutput: TriageOutput;
  rawReport: string;
  memoryContext?: string;
}

export async function runDuplicateAgent(input: DuplicateInput): Promise<{
  success: boolean;
  data: DuplicateOutput | null;
  error?: string;
}> {
  const currentIncident = {
    rawReport: input.rawReport,
    triage: input.triageOutput,
  };

  const userPrompt = fillTemplate(DUPLICATE_PROMPT, {
    currentIncident: JSON.stringify(currentIncident, null, 2),
    memoryContext: input.memoryContext ?? "No prior incidents in memory.",
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "duplicate-agent");
    const parsed = DuplicateSchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "duplicate-agent-repair");
    const reparsed = DuplicateSchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
