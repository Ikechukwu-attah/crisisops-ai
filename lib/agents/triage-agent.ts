import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, TRIAGE_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import { TriageSchema, type TriageOutput } from "@/lib/validation/schemas";

interface TriageInput {
  rawReport: string;
  locationRaw?: string;
  memoryContext?: string;
}

export async function runTriageAgent(input: TriageInput): Promise<{
  success: boolean;
  data: TriageOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(TRIAGE_PROMPT, {
    rawReport: input.rawReport,
    locationRaw: input.locationRaw ?? "Not provided",
    memoryContext: input.memoryContext ?? "No prior memory available",
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "triage-agent");
    const parsed = TriageSchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    // Retry with repair
    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "triage-agent-repair");
    const reparsed = TriageSchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
