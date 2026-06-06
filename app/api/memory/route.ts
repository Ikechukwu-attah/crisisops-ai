import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const memories = await prisma.incidentMemory.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(memories);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
