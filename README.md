# TowerHQ

**Your AI Executive Team** — A web chat application that gives solo founders instant access to an AI executive team: a CTO (Ada), CPO (Grace), CMO (Tony), and CFO (Val).

## Features

- 🏰 **6 Dedicated Channels** — #general, #engineering, #product, #marketing, #finance, #decisions
- 🤖 **4 AI Personas** — Each with domain expertise and personality
- 💬 **Discord-like UI** — Clean, dark, focused interface
- 🔐 **Magic Link Auth** — Passwordless authentication
- 📱 **Mobile Responsive** — Works on any device
- 📤 **Data Export** — Download your conversations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenClaw Gateway integration
- **Auth**: Magic link (email-based)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Generate Prisma client
npx prisma generate

# Push database schema (development)
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## AI Personas

| Persona | Role | Channel | Color |
|---------|------|---------|-------|
| Ada 🧠 | CTO | #engineering | Green |
| Grace 🎯 | CPO | #product | Yellow |
| Tony 📣 | CMO | #marketing | Pink |
| Val 📊 | CFO | #finance | Red |

## Project Structure

```
tower-hq/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── app/            # Main chat interface
│   │   ├── login/          # Auth pages
│   │   ├── onboarding/     # Onboarding flow
│   │   └── settings/       # Settings page
│   ├── components/         # React components
│   │   ├── chat/          # Chat UI components
│   │   ├── landing/       # Landing page components
│   │   └── layout/        # Layout components
│   └── lib/               # Utilities and helpers
├── prisma/                # Database schema
└── public/               # Static assets
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENCLAW_GATEWAY_URL` | OpenClaw API endpoint |
| `OPENCLAW_API_TOKEN` | OpenClaw authentication token |
| `EMAIL_SERVICE_API_KEY` | Email provider API key (e.g., Resend) |
| `SESSION_SECRET` | Secret for session encryption |

## Development

```bash
# Run development server
npm run dev

# Run Prisma Studio (database GUI)
npm run db:studio

# Create database migration
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

## Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run `npm run build`
4. Deploy to Vercel, Railway, or your platform of choice

## License

MIT © 2026 Substr8 Labs
