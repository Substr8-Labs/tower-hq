# TowerHQ Production Setup

This guide covers deploying TowerHQ to production with Vercel + Neon (PostgreSQL).

## Prerequisites

- GitHub account (repo already at Substr8-Labs/tower-hq)
- Vercel account (free tier works)
- Neon account (free tier works) or Supabase

## Step 1: Set Up Database (Neon)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project (e.g., "towerhq")
3. Copy the connection string from the dashboard
   - Format: `postgresql://user:pass@host/dbname?sslmode=require`
4. Keep this for Step 3

### Alternative: Supabase

1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database
3. Copy the "Connection string (URI)" under "Connection Pooling"
4. Add `?pgbouncer=true` to the end

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import `Substr8-Labs/tower-hq`
4. Configure build settings (should auto-detect Next.js):
   - Framework: Next.js
   - Build Command: `npx prisma generate && next build`
   - Output Directory: `.next`

## Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...your-neon-connection-string...
OPENCLAW_GATEWAY_URL=https://srv1338949.tail2b522f.ts.net/api/chat
OPENCLAW_API_TOKEN=your-token-if-required
SESSION_SECRET=generate-a-random-32-char-string
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

For production email (optional for Phase 1):
```
EMAIL_SERVICE_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@substr8labs.com
```

## Step 4: Run Database Migrations

After first deploy, run migrations:

```bash
# Local (with DATABASE_URL set)
npx prisma migrate deploy

# Or via Vercel CLI
vercel env pull
npx prisma migrate deploy
```

## Step 5: Verify Deployment

1. Visit your Vercel URL
2. Check `/api/health` returns `{"status":"ok"}`
3. Try the login flow
4. Test a message in a channel

## OpenClaw Gateway Integration

TowerHQ connects to your OpenClaw Gateway for AI responses.

**Current setup:** Gateway runs on `srv1338949.tail2b522f.ts.net` (Tailscale Funnel)

**For Vercel to reach the gateway:**
1. Ensure Tailscale Funnel is enabled: `sudo tailscale serve --bg --https=443 http://127.0.0.1:18789`
2. The gateway URL should be publicly accessible via the Funnel

**Alternative:** Deploy gateway with public endpoint or use Cloudflare Tunnel.

## Troubleshooting

### Database connection fails
- Check DATABASE_URL is correct and includes `?sslmode=require`
- Verify IP allowlist in Neon (should allow all by default)

### OpenClaw responses fail
- Check OPENCLAW_GATEWAY_URL is accessible from internet
- Verify Tailscale Funnel is running
- Check gateway logs: `journalctl --user -u openclaw-gateway.service -f`

### Prisma errors
- Run `npx prisma generate` before `next build`
- Ensure `prisma` is in dependencies (not just devDependencies)

## Scaling Notes

Free tier limits:
- **Neon:** 0.5 GB storage, 10 compute hours/month
- **Supabase:** 500 MB storage, 50k monthly active users
- **Vercel:** 100 GB bandwidth, serverless limits

For production: upgrade to paid tiers as needed.
