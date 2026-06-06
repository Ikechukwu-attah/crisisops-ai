import { callQwenJson } from "@/lib/qwen/client";
import { BASE_SYSTEM_PROMPT, VERIFICATION_PROMPT, fillTemplate } from "@/lib/qwen/prompts";
import { VerificationSchema, type VerificationOutput, type TriageOutput } from "@/lib/validation/schemas";

interface VerificationInput {
  rawReport: string;
  triageOutput: TriageOutput;
}

export async function runVerificationAgent(input: VerificationInput): Promise<{
  success: boolean;
  data: VerificationOutput | null;
  error?: string;
}> {
  const userPrompt = fillTemplate(VERIFICATION_PROMPT, {
    rawReport: input.rawReport,
    triageOutput: JSON.stringify(input.triageOutput, null, 2),
  });

  try {
    const raw = await callQwenJson(BASE_SYSTEM_PROMPT, userPrompt, undefined, "verification-agent");
    const parsed = VerificationSchema.safeParse(raw);

    if (parsed.success) return { success: true, data: parsed.data };

    const repairPrompt = `Fix this JSON to match the required schema. Issues: ${JSON.stringify(parsed.error.issues)}. Current JSON: ${JSON.stringify(raw)}. Return only the corrected JSON.`;
    const repaired = await callQwenJson(BASE_SYSTEM_PROMPT, repairPrompt, undefined, "verification-agent-repair");
    const reparsed = VerificationSchema.safeParse(repaired);

    if (reparsed.success) return { success: true, data: reparsed.data };
    return { success: false, data: null, error: `Validation failed: ${JSON.stringify(reparsed.error.issues)}` };
  } catch (err) {
    return { success: false, data: null, error: String(err) };
  }
}
