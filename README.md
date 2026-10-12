<p align="center">
  <img src="apps/web/public/yarvo-logo-dark-horizontal.png" alt="Yarvo Hotel PMS" width="260" />
</p>

<h3 align="center">Yarvo Hotel PMS</h3>
<p align="center">A strictly modular, luxury Property Management System built for modern hotels.</p>

<p align="center">
  <a href="https://github.com/HILTONJACKSO/Yarvo-hotel/actions/workflows/deploy.yml">
    <img src="https://github.com/HILTONJACKSO/Yarvo-hotel/actions/workflows/deploy.yml/badge.svg" alt="Deploy" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen" alt="Node" />
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-10-red" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-blue" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/license-MIT-gold" alt="License" />
</p>

---

## ✨ Overview

**Yarvo Hotel PMS** is a full-stack, cloud-native hotel management platform. It is designed to be **strictly modular** — you choose only the modules your property needs, and the system grows with you.

> Built with Next.js 16 (frontend), NestJS (API), PostgreSQL 16, Redis, and Docker — deployed on any VPS with a single `docker compose up`.

---

## 🏗️ Architecture

```
yarvohotel/
├── apps/
│   ├── web/          # Next.js 16 frontend (App Router, TypeScript)
│   └── api/          # NestJS REST API (TypeScript, Prisma ORM)
├── packages/
│   ├── database/     # Prisma schema, migrations, seed scripts
│   └── shared/       # Shared types and utilities
├── nginx/            # Production reverse-proxy config
├── docker-compose.yml           # Local development
└── docker-compose.prod.yml      # Production (VPS)
```

---

## 🚀 Features

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Live metrics — occupancy, revenue, check-ins |
| 📅 **Reservations** | Full reservation lifecycle management |
| 👥 **Guests & CRM** | Guest profiles, history, preferences |
| 🛏️ **Rooms & Room Types** | Inventory, availability, pricing |
| 🧹 **Housekeeping** | Real-time room status, task assignment |
| 🔧 **Maintenance** | Work order tracking |
| 💳 **Billing & Folio** | Charges, payments, receipts, invoices |
| 🍽️ **POS / Restaurant** | Menu management, table orders |
| 📦 **Inventory** | Stock tracking and alerts |
| 📊 **Reports & Financials** | Revenue reports, night audit |
| 🔐 **Super Admin** | Multi-property SaaS control plane |
| 📨 **Notifications** | Email (Resend) + WhatsApp Business |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS, Framer Motion |
| Backend | NestJS 10, TypeScript, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens), HTTP-only cookies |
| Reverse Proxy | Nginx (SSL termination, HSTS) |
| CI/CD | GitHub Actions → Hostinger VPS (Docker) |
| PWA | Serwist (service worker, offline support) |

---

## ⚙️ Local Development

### Prerequisites
- Node.js ≥ 22
- npm ≥ 11
- Docker Desktop
- PostgreSQL 16 (or use Docker Compose)

### 1. Clone the repo
```bash
git clone https://github.com/HILTONJACKSO/Yarvo-hotel.git
cd Yarvo-hotel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.development
# Edit .env.development with your local DB credentials
```

### 4. Run database migrations
```bash
npm run migrate
```

### 5. Seed the Super Admin
```bash
node packages/database/seed-superadmin.js
```

### 6. Start development servers
```bash
npm run dev
```

- **Web:** http://localhost:3000
- **API:** http://localhost:3001
- **API Docs (Swagger):** http://localhost:3001/api/docs

---

## 🐳 Production Deployment (Hostinger VPS)

Quick summary:
```bash
# On your VPS (first time only)
git clone https://github.com/HILTONJACKSO/Yarvo-hotel.git /opt/yarvohotel
cd /opt/yarvohotel
cp .env.production.example .env.production
# Fill in .env.production secrets
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

After the first setup, **every push to `main` auto-deploys via GitHub Actions**.

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `DOMAIN` | Your production domain (e.g. `yarvohotel.com`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Random 32-byte hex string |
| `JWT_REFRESH_SECRET` | Random 32-byte hex string |
| `COOKIE_SECRET` | Random 32-byte hex string |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp Business access token (optional) |

Copy [`.env.production.example`](.env.production.example) for the full list.

---

## 📁 Key Files

| File | Purpose |
|---|---|
| [`apps/web/src/app/page.tsx`](apps/web/src/app/page.tsx) | Landing page |
| [`apps/web/src/app/dashboard/`](apps/web/src/app/dashboard/) | Hotel dashboard |
| [`apps/web/src/app/super-admin/`](apps/web/src/app/super-admin/) | Super Admin control plane |
| [`apps/api/src/modules/`](apps/api/src/modules/) | NestJS feature modules |
| [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma) | Database schema |
| [`docker-compose.prod.yml`](docker-compose.prod.yml) | Production Docker stack |
| [`nginx/conf.d/yarvo.conf`](nginx/conf.d/yarvo.conf) | Nginx vhost (HTTPS) |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | CI/CD pipeline |

---

## 📄 License

MIT © 2026 Yarvo Hotel PMS
