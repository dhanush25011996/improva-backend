import { Router } from "express";
import {
  bookSeat,
  cancelSeat,
  getPassengerBySeat,
  getTicketStatusBySeat,
  listClosedTickets,
  listOpenTickets,
  resetAllBookings,
  updatePassengerBySeat,
} from "../controllers/booking.controller";

const router = Router();

router.get("/open", listOpenTickets);
router.get("/closed", listClosedTickets);

router.post("/admin/reset", resetAllBookings);

router.get("/:seatNumber/status", getTicketStatusBySeat);
router.get("/:seatNumber/passenger", getPassengerBySeat);
router.patch("/:seatNumber/passenger", updatePassengerBySeat);
router.post("/:seatNumber/book", bookSeat);
router.post("/:seatNumber/cancel", cancelSeat);

export default router;
