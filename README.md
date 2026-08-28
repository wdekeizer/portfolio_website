# website

Portfolio site showcasing coding projects.

- **Frontend**: React + TypeScript, built with Vite, styled with Tailwind CSS (`client/`)
- **Backend**: Node/Express + TypeScript, Prisma ORM (`server/`)
- **Database**: MySQL

## Prerequisites

- Node.js 20+
- A running local MySQL server

## Setup

```bash
npm install                 # installs client + server workspaces
createdb portfolio          # create the local database (adjust name/user as needed)
cp server/.env.example server/.env   # then edit DATABASE_URL if needed
npm run db:migrate          # apply Prisma migrations
npm run -w server db:seed   # optional: add a sample project
```

## Development

Run both in separate terminals:

```bash
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173 (proxies /api to the server)
```

## Project structure

```
client/    Vite + React + TS + Tailwind frontend
server/    Express + TS API
  prisma/  schema.prisma, migrations, seed script
```

## Adding a project

Projects are rows in the `Project` table. Either use `prisma studio`
(`npm run db:studio`) to add rows through a GUI, or extend the seed script.

## Deployment

Not yet configured — frontend and backend can be deployed separately
(e.g. Vercel/Netlify for `client`, a Node host or container for `server`,
and a managed Postgres instance).
