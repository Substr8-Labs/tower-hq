# TowerHQ Setup — Raza's Action Items

**Status:** Auth system complete ✅ | Ready for production deploy

When you're back at your desk, run through these:

## 1. Database (Neon) — 2 min
- [ ] Go to https://neon.tech
- [ ] Sign up (GitHub login works)
- [ ] Create project: "towerhq"
- [ ] Copy connection string (looks like `postgresql://user:pass@host/db?sslmode=require`)
- [ ] Save it — you'll paste this into Vercel

## 2. Tailscale Funnel — 1 min
SSH into the server and run:
```bash
ssh claw@srv1338949
sudo tailscale serve --bg --https=443 --funnel http://127.0.0.1:18789
```
This makes the OpenClaw gateway publicly accessible so Vercel can reach it.

## 3. Vercel Deploy — 5 min
- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] "Add New Project" → Import `Substr8-Labs/tower-hq`
- [ ] Add Environment Variables:
  ```
  DATABASE_URL=<paste your Neon connection string>
  OPENCLAW_GATEWAY_URL=https://srv1338949.tail2b522f.ts.net/api/chat
  SESSION_SECRET=substr8-tower-secret-2026
  NEXT_PUBLIC_APP_URL=https://tower-hq.vercel.app
  ```
- [ ] Deploy

## 4. Email Service (Resend) — 3 min
For magic links to actually send emails:
- [ ] Go to https://resend.com
- [ ] Create account, verify domain (substr8labs.com)
- [ ] Get API key
- [ ] Add to Vercel env vars:
  ```
  EMAIL_SERVICE_API_KEY=re_xxx...
  EMAIL_FROM=noreply@substr8labs.com
  ```
*(Skip for now — dev mode logs magic links to console)*

## 5. Run Database Migration — 1 min
After deploy, in your terminal:
```bash
cd tower-hq
npm install
echo 'DATABASE_URL=<your-neon-string>' > .env
npx prisma migrate deploy
```

## 5. Verify
- [ ] Visit your Vercel URL
- [ ] Check `/api/health` returns `{"status":"ok"}`
- [ ] Try sending a message in #engineering
- [ ] Confirm Ada responds (not mock)

---

**Total time:** ~10 minutes

I'll keep working on improvements while you're out. Ping me when you start and I'll walk you through anything unclear.
