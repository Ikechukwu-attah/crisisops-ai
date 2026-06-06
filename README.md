# CrisisOps AI

**Human-approved multi-agent incident-command assistant for emergency triage, verification, response planning, and public communication.**

## Overview

CrisisOps AI transforms messy natural-language incident reports into structured, verified, prioritized response plans. It is designed for low-resource cities, municipalities, campuses, NGOs, and community-response organizations where emergency reports arrive through fragmented channels.

The system coordinates 7 specialized AI agents powered by Qwen Cloud, with a mandatory human approval step before any sensitive action or public communication.

## Problem

Emergency response workflows fail when information is fragmented, unstructured, duplicated, or delayed. Operators receive reports like:

> "Flooding around Main Street. People stuck in a building. Power is out. Road is blocked. Some elderly people inside."

A human must then manually determine: What happened? Where? How urgent? Who is affected? What is missing? Are there duplicates? What needs communicating? What requires approval?

CrisisOps AI compresses this into a structured AI-assisted workflow with human review at every decision point.

## Solution

A 7-agent pipeline that:
1. Classifies and triages the incident
2. Detects missing information and contradictions
3. Checks for duplicate or related incidents using persistent memory
4. Recommends response resources and first actions
5. Drafts cautious internal and public communications
6. Evaluates safety and legal risks
7. Creates a final operator decision summary

Every output requires human approval before sensitive actions are taken.

## Hackathon Track

**Primary: Track 4 — Autopilot Agent**
- Multi-agent task decomposition
- Tool-like workflow execution
- Persistent memory retrieval
- Human-in-the-loop governance

**Secondary: Track 3 — Agent Society, Track 1 — MemoryAgent**

## Key Features

- 7-agent sequential pipeline with structured JSON outputs
- Zod schema validation with automatic retry and repair
- Persistent incident memory (keyword-matched retrieval)
- Human approval workflow: Approve / Approve with Edits / Reject / Request More Info
- Public alert drafts always flagged as requiring approval
- Full audit log for every agent action and operator decision
- Dark emergency-operations dashboard UI
- 4 demo scenarios for immediate testing
- SQLite database with Prisma ORM

## Agent Workflow

```
1. Triage Agent          — classify type, severity, urgency, affected people
2. Verification Agent    — detect missing info, contradictions, clarifying questions
3. Duplicate Agent       — compare with memory, flag possible duplicates
4. Resource Planner      — recommend resource categories and first actions
5. Communications Agent  — draft internal note, public alert, reporter follow-up
6. Risk & Safety Agent   — evaluate safety, legal, and misinformation risks
7. Decision Summary      — create operator checklist and recommended decision
```

## Architecture

```
[Operator UI]
     |
     v
[Incident Intake API]
     |
     v
[Incident Database] <-----> [Memory Store]
     |
     v
[Agent Orchestrator]
     |
     |---> [Triage Agent]
     |---> [Verification Agent]
     |---> [Duplicate Detection Agent]
     |---> [Resource Planner Agent]
     |---> [Communications Agent]
     |---> [Risk & Safety Agent]
     |---> [Decision Summary Agent]
     |
     v
[Structured Response Plan]
     |
     v
[Human Approval UI]
     |
     v
[Audit Log + Final Incident Record]
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| AI | Qwen Cloud via OpenAI-compatible SDK (qwen-max / qwen-plus) |
| Database | SQLite via Prisma ORM |
| Validation | Zod |

## Data Model

| Model | Purpose |
|-------|---------|
| `Incident` | Core incident record with triage fields and status |
| `AgentResult` | JSON output from each agent, stored per incident |
| `Approval` | Operator approval decisions with notes and edits |
| `AuditLog` | Append-only log of all system actions |
| `IncidentMemory` | Persistent cross-incident memory for agent context |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `QWEN_API_KEY` | Your Qwen Cloud API key |
| `QWEN_BASE_URL` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | Primary model, e.g. `qwen-plus` |
| `QWEN_AGENT_MODEL` | Agent model, e.g. `qwen-max` |
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db` |

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/crisisops-ai.git
cd crisisops-ai

# 2. Install dependencies (requires Node.js 20.19+ or 22+)
npm install

# 3. Set environment variables
cp .env.example .env.local
# Edit .env.local and add your QWEN_API_KEY

# 4. Initialize the database
DATABASE_URL="file:./dev.db" npx prisma db push

# 5. Seed demo memory
DATABASE_URL="file:./dev.db" npx tsx prisma/seed.ts

# 6. Start development server
npm run dev
```

## Running the App

```bash
npm run dev
# Open http://localhost:3000
```

**Verify Qwen connection:**
```
GET http://localhost:3000/api/qwen-test
```

**Re-seed memory via API:**
```
POST http://localhost:3000/api/memory/seed
```

## Demo Scenarios

Use the sample-fill buttons on the New Incident page to instantly load these scenarios:

### 1. Flood + Vulnerable People
```
Heavy flooding near Main Street market. Power is out. A resident says elderly people are
trapped inside a nearby apartment building. Road access is blocked by water.
```
Expected: severity high/critical, medical + utility resources, cautious public alert

### 2. Conflicting Fire Report
```
Someone reported smoke near the old warehouse, but another message says it may only be
dust from construction. No flames seen. People are gathering nearby.
```
Expected: contradiction flagged, verification risk high, no confirmed fire claim in alert

### 3. Duplicate Utility Outage
```
Lights are out again around East Junction. Same transformer area as yesterday.
Traffic signals are down and cars are stuck.
```
Expected: memory match to prior East Junction outage, duplicate detection triggered

### 4. Medical Event — Public Event
```
At the city sports field, several people feel dizzy during an outdoor event. It is very hot.
Water supplies are low. No confirmed severe injuries yet.
```
Expected: medical + weather type, water supply resource, missing info about count/age

## Human-in-the-Loop Safety

CrisisOps AI enforces strict human oversight:

- **No public alerts are sent automatically.** Every communications draft is marked `requiresApproval: true` and displayed with a red WARNING banner.
- **No emergency resources are auto-dispatched.** The Resource Planner recommends categories; a human decides deployment.
- **Every approval is stored.** Operators must select Approve, Approve with Edits, Reject, or Request More Info.
- **The Risk & Safety Agent evaluates every plan** before it reaches the approval stage.
- **All actions are logged** in an append-only audit trail.

## Qwen Cloud Usage

The system uses two Qwen models via the OpenAI-compatible endpoint:

- **qwen-max** (`QWEN_AGENT_MODEL`): Used for all 7 agent reasoning calls requiring deep analysis
- **qwen-plus** (`QWEN_MODEL`): Available for lighter utility calls

API endpoint: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`

The Qwen client wrapper (`lib/qwen/client.ts`) handles:
- JSON parsing with automatic repair on failure
- Retry logic with a structured repair prompt
- Safe logging (agent name only, never API keys or full prompts)

## Future Improvements

1. Map view for incident clustering
2. Real-time WebSocket status updates
3. Voice-to-text incident intake
4. PDF incident report export
5. Role-based operator access
6. Vector search for semantic memory retrieval
7. Multilingual incident intake
8. Email/SMS sandbox integration
9. Incident analytics dashboard
10. Offline-first field officer mode

---

Built for the Qwen Cloud Global AI Hackathon — Track 4: Autopilot Agent

Licensed under the MIT License.
