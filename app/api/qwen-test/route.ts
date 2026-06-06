import { NextResponse } from "next/server";
import { callQwenJson } from "@/lib/qwen/client";

export async function GET() {
  try {
    const result = await callQwenJson(
      "You are a helpful assistant. Return only valid JSON.",
      'Return this JSON exactly: {"status": "ok", "message": "Qwen connection successful"}',
      process.env.QWEN_MODEL,
      "qwen-test"
    );
    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
