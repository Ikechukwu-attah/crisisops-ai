import { NextResponse } from "next/server";

export async function GET() {
  const qwenConfigured =
    typeof process.env.QWEN_API_KEY === "string" &&
    process.env.QWEN_API_KEY.length > 0 &&
    process.env.QWEN_API_KEY !== "your_qwen_api_key_here";

  return NextResponse.json({
    status: "ok",
    service: "crisisops-ai",
    host: "alibaba-cloud-ready",
    qwenConfigured,
    timestamp: new Date().toISOString(),
  });
}
