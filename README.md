# Furnique-new

This repository contains a starter scaffold for the Furnique ecommerce app (Next.js + TypeScript + Prisma + Tailwind).

Quick start

1. Copy `.env.example` to `.env` and update `DATABASE_URL` and `NEXTAUTH_SECRET`.
2. Install deps: `npm ci`
3. Run Prisma migrate: `npm run prisma:migrate`
4. Seed demo data: `npm run prisma:seed`
5. Run dev server: `npm run dev`

Notes

- The app uses Prisma + Postgres. For local development, run a Postgres instance and set `DATABASE_URL` appropriately.
- NextAuth credentials provider is configured (email/password). Create users in the DB (seed creates a demo user but password is stored in plain text in seed for convenience — replace with hashed password for production).
