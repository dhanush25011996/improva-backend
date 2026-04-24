import "dotenv/config";
import express from "express";
import cors from "cors";
import { logger } from "./helpers/logger.helper";
import healthRoutes from "./routes/health.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const corsOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/booking", bookingRoutes);

app.listen(PORT, () => {
  logger.info(
    { cors_origins: corsOrigins.length > 0 ? corsOrigins : "all" },
    `Server is running on http://localhost:${PORT}`
  );
});
