import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in .env");
}

const totalSeats = process.env.TOTAL_SEATS
  ? Number(process.env.TOTAL_SEATS)
  : 40;

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
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding ${totalSeats} tickets...`);

  const seatNumbers = Array.from({ length: totalSeats }, (_, i) => i + 1);

  for (const seat_number of seatNumbers) {
    await prisma.ticket.upsert({
      where: { seat_number },
      update: {},
      create: { seat_number },
    });
  }

  const open = await prisma.ticket.count({ where: { status: "OPEN" } });
  const closed = await prisma.ticket.count({ where: { status: "CLOSED" } });
  console.log(
    `Seed complete. Tickets -> total: ${totalSeats}, open: ${open}, closed: ${closed}`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
