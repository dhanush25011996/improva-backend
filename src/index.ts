import "dotenv/config";
import express from "express";
import cors from "cors";
import { logger } from "./helpers/logger.helper";
import healthRoutes from "./routes/health.routes";
import bookingRoutes from "./routes/booking.routes";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: true,
  credentials: true,
})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/booking", bookingRoutes);

app.listen(PORT, () => {
  logger.info(
    `Server is running on http://localhost:${PORT}`
  );
});
