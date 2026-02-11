# EduOps Nepal

Production-focused multi-tenant School/Institute Management platform for Nepal.

## Current milestone
This commit implements:
- Prisma schema for all MVP modules (SIS, attendance, fees, admissions, messaging, subscriptions, audit).
- Auth.js setup (Credentials + Google OAuth) with Prisma adapter.
- Multi-tenant request middleware and Prisma tenant query extension foundation.
- Seed data for 2 institutions to validate isolation assumptions.
- Minimal unit tests for RBAC and tenant filter behavior.

## Stack
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- PostgreSQL + Prisma
- Auth.js (next-auth v5 beta)
- Vitest

## Getting started

1. Install dependencies
```bash
npm install
```

2. Configure environment
```bash
cp .env.example .env
```
Fill the values in `.env`.

3. Generate Prisma client
```bash
npm run prisma:generate
```

4. Run migrations
```bash
npm run prisma:migrate
```

5. Seed demo tenants/users
```bash
npm run prisma:seed
```

6. Run dev server
```bash
npm run dev
```

## Demo seeded users
Password for both: `Password@123`
- `owner@everest.edu.np`
- `owner@lumbini.edu.np`

## Tenant isolation approach (MVP foundation)
- `middleware.ts` requires auth for protected modules and injects `x-institution-id`, `x-user-id`, `x-user-role` headers.
- `withTenant(prisma, institutionId, role)` applies institution filters to all tenant-scoped models at Prisma query layer.
- Super Admin bypasses tenant filter.

## Tests
```bash
npm run test
```

## Next implementation steps
1. SIS CRUD route handlers + pages with server-side RBAC checks.
2. Attendance module with teacher workflows.
3. Fees + reminders (Sparrow SMS first).
4. Admissions + RAG-lite chatbot ingestion and lead handoff.
5. Reporting dashboards.
6. Khalti subscription checkout + webhook + plan gates.
