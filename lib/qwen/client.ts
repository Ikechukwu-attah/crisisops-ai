import OpenAI from "openai";

export const qwenClient = new OpenAI({
  apiKey: process.env.QWEN_API_KEY ?? "placeholder",
  baseURL: process.env.QWEN_BASE_URL ?? "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
});

const REPAIR_PROMPT = "The previous response was not valid JSON. Return only the JSON object, no markdown, no commentary.";

export async function callQwenJson(
  systemPrompt: string,
  userPrompt: string,
  model?: string,
  agentName = "unknown"
): Promise<unknown> {
  const targetModel = model ?? process.env.QWEN_AGENT_MODEL ?? process.env.QWEN_MODEL ?? "qwen-plus";
  console.log(`[QWEN REQUEST] agent: ${agentName}`);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const response = await qwenClient.chat.completions.create({
    model: targetModel,
    messages,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content ?? "";

  try {
    return parseJsonContent(content);
  } catch {
    console.log(`[QWEN REPAIR] agent: ${agentName} - retrying with repair prompt`);
    const repairMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      ...messages,
      { role: "assistant", content },
      { role: "user", content: REPAIR_PROMPT },
    ];
    const repairResponse = await qwenClient.chat.completions.create({
      model: targetModel,
      messages: repairMessages,
      temperature: 0,
    });
    const repairContent = repairResponse.choices[0]?.message?.content ?? "{}";
    return parseJsonContent(repairContent);
  }
}

function parseJsonContent(content: string): unknown {
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}
