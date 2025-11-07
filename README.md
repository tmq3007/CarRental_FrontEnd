# CarRental Frontend

This repository contains the frontend application for the CarRental project — a Next.js + TypeScript application using Tailwind CSS. It provides the UI for searching, booking, listing and managing cars.

> Note: This README was generated from repository structure and conventions. If your project uses a monorepo tool (pnpm/workspaces) or other specific scripts, update the scripts and commands below to match your local setup.

## Table of contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## Features

- Next.js (App Router) + TypeScript
- Tailwind CSS for styles
- Component-driven structure under `src/components`
- Pages / routes under `src/app`
- Client and server API calls under `src/lib` / `src/services`

## Prerequisites

- Node.js 16+ (Node 18 recommended)
- npm, yarn, or pnpm (examples below use `npm`)

## Getting started

1. Clone the repository

```powershell
git clone <repository-url>
cd CarRental_FrontEnd
```

2. Install dependencies

```powershell
npm install
# or `yarn` or `pnpm install`
```

3. Create environment variables

Copy `.env.example` to `.env.local` (if present) and set values. See the Environment variables section below.

4. Run the dev server

```powershell
npm run dev
# visit http://localhost:3000
```

## Environment variables

Put runtime configuration in `.env.local` at the project root. Typical variables you may need to set (update names to match your backend):

- NEXT_PUBLIC_API_URL=https://api.example.com
- NEXT_PUBLIC_VNPAY_URL=... (if using vnpay callback)

> If you don't have the exact names, check `src/lib/services` or any `fetch`/`axios` usages to find which env keys are expected.

## Scripts

The repository likely exposes standard Next.js scripts in `package.json`. Common commands:

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server after build
- `npm run lint` — Run linters (if configured)
- `npm run typecheck` — Run TypeScript checks (if configured)

Open `package.json` to confirm exact script names and adjust commands accordingly.

## Project structure (high level)

Key folders you will work with:

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable UI components and feature components
- `src/lib/` — Utilities, API clients, store (Redux/RTK) and helpers
- `src/@types/` — TypeScript custom declarations
- `public/` — Static assets (images, icons)

Example notable paths seen in the repository:

- `src/app/(car-rent)/home/car-list/[carId]/page.tsx` — car detail / booking page
- `src/components/rent-a-car/` — booking flow components (order summary, checkout step)
- `src/lib/services/booking-api.ts` — REST/RTK endpoints for booking (if present)

## Contributing

1. Create a feature branch from `feature/*` or `main` as your workflow requires
2. Commit with clear messages
3. Open a pull request to `feature/dat-branch` (or the target branch used by your team)

If you plan to work on larger changes (API updates, migrations) please open an issue first with a short plan.

## Troubleshooting

- If you see type errors, run `npm run typecheck` (or `tsc --noEmit`) to view details.
- If styles are missing, ensure Tailwind is installed and `globals.css` is imported by `src/app/globals.css`.
- For runtime API errors, confirm `NEXT_PUBLIC_API_URL` (or backend URL) is set correctly.

## Next steps / TODO

- Add a `.env.example` with the minimum environment variables used by the app.
- Add a license file if you want to open-source this project (e.g., `LICENSE` with MIT).

---

If you want, I can:

- Inspect `package.json` and add exact scripts and Node version to this README.
- Add a `.env.example` with the env keys the app expects.
- Add a short CONTRIBUTING.md or LICENSE file.

Please tell me which one you want next.This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
