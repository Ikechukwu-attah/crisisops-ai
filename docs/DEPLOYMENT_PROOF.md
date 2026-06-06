# CrisisOps AI — Deployment Proof for Qwen Cloud Hackathon

This document describes what evidence to capture and submit to prove Alibaba Cloud and Qwen Cloud usage for the hackathon submission.

---

## Required Proof Items

### 1. Health Endpoint Response

Hit the health endpoint on the deployed ECS instance and save the output:

```bash
curl http://<ECS_PUBLIC_IP>/api/health
```

Expected:

```json
{
  "status": "ok",
  "service": "crisisops-ai",
  "host": "alibaba-cloud-ready",
  "qwenConfigured": true,
  "timestamp": "2026-06-06T10:00:00.000Z"
}
```

**Screenshot:** Browser or terminal showing `qwenConfigured: true` with the ECS public IP visible in the URL.

---

### 2. ECS Instance Running

**Screenshot from Alibaba Cloud Console:**

- Navigate to **Elastic Compute Service → Instances**.
- Show the instance in **Running** state.
- The instance region, ID, and public IP must be visible.

---

### 3. Docker Container Running on ECS

SSH into the ECS instance and run:

```bash
docker compose ps
```

**Screenshot:** Terminal showing the `crisisops-ai` container with status `running (healthy)`.

---

### 4. Application Accessible from Public IP

**Screenshot:** Browser showing `http://<ECS_PUBLIC_IP>` with the CrisisOps AI landing page loaded.

The landing page shows:
- "Powered by Qwen Cloud" section
- The Qwen model names (`qwen-max`, `qwen-plus`)
- The Track 3 Agent Society badge

---

### 5. Incident Analysis Working End-to-End

**Steps to capture:**

1. Go to `http://<ECS_PUBLIC_IP>/incidents/new`.
2. Click the **Flooding + Trapped Residents** demo scenario.
3. Click **Run Agent Analysis**.
4. Wait for the 7-agent pipeline to complete.
5. Show the result page reaching `PENDING_APPROVAL` status.

**Screenshot:** Incident result page showing:
- Agent Workflow Timeline with all 7 agents marked **Completed**
- Severity badge (high or critical)
- Operator checklist from Decision Summary Agent
- Approval panel awaiting decision

---

### 6. Qwen Cloud API Call Proof

**Option A — Docker logs:**

```bash
docker compose logs crisisops-ai | grep "\[QWEN REQUEST\]"
```

Expected output:

```
[QWEN REQUEST] agent: triage-agent
[QWEN REQUEST] agent: verification-agent
[QWEN REQUEST] agent: duplicate-agent
[QWEN REQUEST] agent: resource-planner-agent
[QWEN REQUEST] agent: communications-agent
[QWEN REQUEST] agent: risk-safety-agent
[QWEN REQUEST] agent: decision-summary-agent
```

**Screenshot:** Terminal showing QWEN REQUEST log lines. These prove the app called the Qwen Cloud API for each agent.

**Option B — Alibaba Cloud DashScope Console:**

- Log in to Alibaba Cloud.
- Go to **DashScope → API Call Records**.
- Show call logs for `qwen-max` and `qwen-plus` with timestamps matching your demo.

---

### 7. Approval Workflow Proof

**Steps:**

1. On the result page, enter your name in the **Operator Name** field.
2. Click **Approve Plan**.
3. Click **Record Decision**.
4. Show the status changing to `APPROVED`.
5. Show the audit timeline at the bottom with `approval_submitted` entry.

**Screenshot:** Audit Timeline showing the full sequence:
- `incident_created`
- `agent_completed` × 7
- `analysis_complete`
- `approval_submitted`

---

### 8. Memory Page Showing Persistent Memory

**Screenshot:** `http://<ECS_PUBLIC_IP>/memory` page showing the 4 seeded memory records grouped by type (Incident, Location, Decision).

This proves the persistent memory layer is working and injecting context into agent prompts.

---

## Submission Checklist

Before submitting to Devpost:

- [ ] Screenshot 1: ECS instance running in Alibaba Cloud Console
- [ ] Screenshot 2: `docker compose ps` showing healthy container
- [ ] Screenshot 3: Landing page at ECS public IP
- [ ] Screenshot 4: `/api/health` returning `qwenConfigured: true`
- [ ] Screenshot 5: Incident analysis result page (7 agents completed)
- [ ] Screenshot 6: Docker logs showing `[QWEN REQUEST]` lines
- [ ] Screenshot 7: Approval submitted + audit timeline
- [ ] Screenshot 8: Memory page with records
- [ ] GitHub repository URL (public)
- [ ] Demo video (3 minutes): intake → analysis → approval → audit log

---

## What the Proof Demonstrates

| Requirement | Evidence |
|-------------|----------|
| Qwen Cloud usage | `[QWEN REQUEST]` logs + `/api/health` `qwenConfigured: true` + DashScope call records |
| Alibaba Cloud deployment | ECS instance screenshot + public IP accessible |
| Multi-agent pipeline | 7 agents completed on result page timeline |
| Human-in-the-loop | Approval panel + audit log entry |
| Persistent memory | Memory page with seeded records |
| Production-ready | Docker container healthy, Nginx proxy, SQLite volume |
| Security | API key in env var only, never in source code or browser |
