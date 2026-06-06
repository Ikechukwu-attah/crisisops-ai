import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const SEED_MEMORIES = [
  {
    memoryType: "incident",
    title: "Major Flood — Main Street Market Area",
    content:
      "Severe flooding occurred near Main Street market. Power was out for 6 hours. Elderly residents were evacuated from Riverside Apartments. Road access was blocked for 4 hours. Utility team restored power within 8 hours.",
    sourceIncidentId: null,
    tags: "flood,main street,power outage,elderly,evacuation,riverside",
  },
  {
    memoryType: "location",
    title: "East Junction — Repeated Transformer Failures",
    content:
      "East Junction transformer has failed 3 times in the past 12 months. Outages typically last 2-4 hours. Traffic signals are always affected. Known infrastructure weakness — flagged for utility authority review.",
    sourceIncidentId: null,
    tags: "east junction,utility,transformer,outage,traffic signals,infrastructure",
  },
  {
    memoryType: "decision",
    title: "Approved Alert Template — Flooding",
    content:
      "Approved public alert format: 'Reports indicate flooding in [area]. Residents are advised to avoid the area and seek higher ground if needed. Emergency teams are on route. Further updates will follow after field verification.'",
    sourceIncidentId: null,
    tags: "flood,public alert,template,approved,communication",
  },
  {
    memoryType: "incident",
    title: "Medical Event — City Sports Field Heat Incident",
    content:
      "Multiple attendees at outdoor sports event experienced heat exhaustion. 12 people treated on site. Water supplies were insufficient. Medical team arrived within 15 minutes. Event was suspended. Key lesson: require event water supply verification for outdoor events in summer.",
    sourceIncidentId: null,
    tags: "medical,heat,sports field,outdoor event,water supply,heat exhaustion",
  },
];

export async function POST() {
  try {
    await prisma.incidentMemory.deleteMany();
    const created = await prisma.incidentMemory.createMany({
      data: SEED_MEMORIES,
    });
    return NextResponse.json({ success: true, count: created.count });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
