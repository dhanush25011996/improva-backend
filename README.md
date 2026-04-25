# Improva Backend

Node.js + Express + TypeScript backend for the bus ticket booking assignment.

## Tech Stack

- Node.js
- Express
- TypeScript
- Prisma ORM (MySQL)
- Pino logger

## Prerequisites

- Node.js 18+ (recommended Node 20+)
- npm
- MySQL running locally

## Environment

Create `.env` in `improva-backend`:

```env
PORT=3000
DATABASE_URL="mysql://root:admin@localhost:3306/improva"
TOTAL_SEATS=40
CORS_ORIGINS="http://localhost:3001,http://localhost:3002,http://localhost:3003"
```

Notes:
- `PORT` is required by current server setup.
- `DATABASE_URL` must point to an existing MySQL schema.
- `TOTAL_SEATS` is used by seed script.
- `CORS_ORIGINS` can be left empty only if you allow all origins in code.

## Install

From `improva-backend`:

```bash
npm install
```

## Database Setup

1) Make sure MySQL schema exists:

```sql
CREATE DATABASE improva;
```

2) Generate Prisma client:

```bash
npm run prisma:generate
```

3) Apply migrations:

```bash
npx prisma migrate deploy
```

4) Seed 40 seats:

```bash
npm run db:seed
```

## Run Server

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

## Base URL

`http://localhost:3000/api/v1`

## Available Routes

Health:
- `GET /health`

Booking:
- `GET /booking/open`
- `GET /booking/closed`
- `GET /booking/:seatNumber/status`
- `GET /booking/:seatNumber/passenger`
- `POST /booking/:seatNumber/book`
- `PATCH /booking/:seatNumber/passenger`
- `POST /booking/:seatNumber/cancel`
- `POST /booking/admin/reset`

## Postman

Collection file:

- `improva-backend/postman.json`
