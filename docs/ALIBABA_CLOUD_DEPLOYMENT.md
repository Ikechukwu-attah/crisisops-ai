# CrisisOps AI — Alibaba Cloud ECS Deployment Guide

This guide deploys the full CrisisOps AI Next.js application (frontend + API routes + agent orchestrator) on a single Alibaba Cloud ECS instance using Docker.

---

## Architecture

```
[Browser]
    |  HTTPS
    v
[Alibaba Cloud ECS Instance]
    |  Nginx reverse proxy (port 80/443 → 3000)
    v
[Docker Container: crisisops-ai]
    |  Next.js App Router + API Routes
    |  Agent Orchestrator (7 Qwen agents)
    v
[Qwen Cloud API]
    dashscope-intl.aliyuncs.com/compatible-mode/v1
    Models: qwen-max (agents) · qwen-plus (utilities)
    v
[Prisma ORM + SQLite]
    Mounted Docker volume: /app/data/production.db
    v
[Audit Log + Human Approval Workflow]
    Stored in SQLite — all agent results, approvals, audit entries
```

---

## Prerequisites

- Alibaba Cloud account
- ECS instance running Ubuntu 22.04 LTS (minimum 2 vCPU, 4 GB RAM recommended)
- Security group rules: port 80, 443, 22 open
- Docker and Docker Compose installed on ECS
- A valid `QWEN_API_KEY` from Alibaba Cloud DashScope

---

## Step 1 — Launch ECS Instance

1. Log in to the Alibaba Cloud Console.
2. Go to **Elastic Compute Service → Instances**.
3. Click **Create Instance**.
4. Choose:
   - Region: any (select closest to your users)
   - Instance type: ecs.c6.large (2 vCPU / 4 GB) or larger
   - Image: Ubuntu 22.04 LTS (64-bit)
   - System disk: 40 GB SSD
5. Configure security group:
   - Inbound: TCP 22 (SSH), TCP 80 (HTTP), TCP 443 (HTTPS)
6. Create or use an existing key pair.
7. Launch the instance and note the public IP.

---

## Step 2 — Install Docker on ECS

SSH into your instance:

```bash
ssh -i your-key.pem root@<ECS_PUBLIC_IP>
```

Install Docker:

```bash
apt-get update -y
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable docker
systemctl start docker
```

Verify:

```bash
docker --version
docker compose version
```

---

## Step 3 — Transfer the App to ECS

**Option A — Git clone (recommended):**

```bash
git clone https://github.com/Ikechukwu-attah/crisisops-ai.git
cd crisisops-ai
```

**Option B — SCP upload:**

```bash
# From your local machine:
scp -i your-key.pem -r ./crisisops-ai root@<ECS_PUBLIC_IP>:/opt/crisisops-ai
```

---

## Step 4 — Configure Environment Variables

On the ECS instance, create the production environment file:

```bash
cd /opt/crisisops-ai   # or wherever you cloned/uploaded
cp .env.example .env.production
nano .env.production
```

Set the following values:

```env
QWEN_API_KEY=your_real_qwen_api_key_here
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
QWEN_AGENT_MODEL=qwen-max
DATABASE_URL=file:/app/data/production.db
```

> **Security:** Never commit `.env.production`. It is already excluded by `.gitignore`.

Export the key so Docker Compose can read it:

```bash
export QWEN_API_KEY=your_real_qwen_api_key_here
```

Or use an env file with Docker Compose:

```bash
docker compose --env-file .env.production up -d
```

---

## Step 5 — Initialize the Database

Before first run, start the container and run the Prisma migration:

```bash
docker compose --env-file .env.production run --rm crisisops-ai \
  sh -c "DATABASE_URL=file:/app/data/production.db npx prisma db push"
```

Seed demo memory (optional but recommended for demo):

```bash
docker compose --env-file .env.production run --rm crisisops-ai \
  sh -c "DATABASE_URL=file:/app/data/production.db npx tsx prisma/seed.ts"
```

---

## Step 6 — Build and Start

```bash
docker compose --env-file .env.production up -d --build
```

Check the container is healthy:

```bash
docker compose ps
docker compose logs -f crisisops-ai
```

---

## Step 7 — Verify the Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "crisisops-ai",
  "host": "alibaba-cloud-ready",
  "qwenConfigured": true,
  "timestamp": "2026-06-06T10:00:00.000Z"
}
```

`qwenConfigured: true` confirms the API key is loaded. If it returns `false`, check that `QWEN_API_KEY` is set.

---

## Step 8 — Set Up Nginx Reverse Proxy (Optional but Recommended)

```bash
apt-get install -y nginx

cat > /etc/nginx/sites-available/crisisops-ai << 'EOF'
server {
    listen 80;
    server_name <YOUR_DOMAIN_OR_ECS_IP>;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/crisisops-ai /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

The app is now accessible at `http://<ECS_PUBLIC_IP>`.

---

## Step 9 — Verify End-to-End

1. Open `http://<ECS_PUBLIC_IP>` in a browser.
2. Go to `/incidents/new`.
3. Click a demo scenario button.
4. Click **Run Agent Analysis**.
5. Confirm the analysis reaches `PENDING_APPROVAL` status.
6. Submit an approval decision.
7. Check `http://<ECS_PUBLIC_IP>/api/health` returns `qwenConfigured: true`.

---

## Useful Commands

```bash
# View logs
docker compose logs -f crisisops-ai

# Stop
docker compose down

# Restart
docker compose restart crisisops-ai

# Rebuild after code changes
docker compose up -d --build

# Open a shell in the running container
docker compose exec crisisops-ai sh
```

---

## Production Notes

- **Database:** SQLite is used for hackathon demo speed. For production scale, switch to PostgreSQL (Alibaba Cloud RDS for MySQL/PostgreSQL) and update `DATABASE_URL` accordingly.
- **HTTPS:** Use Alibaba Cloud SLB (Server Load Balancer) with an SSL certificate, or install Certbot on the ECS instance.
- **Persistent storage:** The SQLite file is stored in the `crisisops_data` Docker volume, which survives container restarts.
- **API key security:** `QWEN_API_KEY` is read from environment variables only. It is never written to source code, committed to git, or exposed to the browser.
