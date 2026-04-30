import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env file (e.g. mysql://user:pass@localhost:3306/improva)"
  );
}

const parsed = new URL(databaseUrl);
const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: Number(parsed.port || 3306),
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, ""),
  connectTimeout: 10000,
  socketTimeout: 30000,
  acquireTimeout: 30000,
  ssl: {
    rejectUnauthorized: true,
  },
});

export const prisma = new PrismaClient({ adapter });

export default prisma;
