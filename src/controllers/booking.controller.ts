import { Request, Response } from "express";
import {
  bookTicket,
  cancelTicket,
  getAllClosedTickets,
  getAllOpenTickets,
  getTicketPassenger,
  getTicketStatus,
  resetAllTickets,
  updatePassenger,
} from "../services/booking.service";
import {
  buildSuccessResponse,
  buildFailedResponse,
} from "../helpers/response.helper";
import { logger } from "../helpers/logger.helper";
import { AppError } from "../helpers/app-error.helper";

const handleError = (
  error: unknown,
  res: Response,
  api_name: string,
  timestamp: string
): void => {
  if (error instanceof AppError) {
    logger.warn({ api_name, err: error.message }, `${api_name}: Failed`);
    buildFailedResponse(
      res,
      api_name,
      timestamp,
      { error: error.message },
      error.statusCode
    );
    return;
  }

  logger.error({ api_name, err: error }, `${api_name}: Unhandled error`);
  buildFailedResponse(
    res,
    api_name,
    timestamp,
    { error: "Internal Server Error" },
    500
  );
};

export const listOpenTickets = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: List Open Tickets", new Date().toISOString()];

  try {
    const tickets = await getAllOpenTickets();
    logger.info({ api_name, count: tickets.length }, `${api_name}: Successful`);
    buildSuccessResponse(res, api_name, timestamp, {
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const listClosedTickets = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: List Closed Tickets", new Date().toISOString()];

  try {
    const tickets = await getAllClosedTickets();
    logger.info({ api_name, count: tickets.length }, `${api_name}: Successful`);
    buildSuccessResponse(res, api_name, timestamp, {
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const getTicketStatusBySeat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Get Ticket Status", new Date().toISOString()];

  try {
    const data = await getTicketStatus(req.params.seatNumber);
    logger.info({ api_name, seat: data.seat_number }, `${api_name}: Successful`);
    buildSuccessResponse(res, api_name, timestamp, data);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const getPassengerBySeat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Get Passenger Details", new Date().toISOString()];

  try {
    const data = await getTicketPassenger(req.params.seatNumber);
    logger.info({ api_name, seat: data.seat_number }, `${api_name}: Successful`);
    buildSuccessResponse(res, api_name, timestamp, data);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const bookSeat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Book Seat", new Date().toISOString()];

  try {
    const ticket = await bookTicket(req.params.seatNumber, req.body?.passenger);
    logger.info(
      { api_name, seat: ticket.seat_number },
      `${api_name}: Successful`
    );
    buildSuccessResponse(res, api_name, timestamp, ticket);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const updatePassengerBySeat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Update Passenger", new Date().toISOString()];

  try {
    const ticket = await updatePassenger(req.params.seatNumber, req.body?.passenger);
    logger.info(
      { api_name, seat: ticket.seat_number },
      `${api_name}: Successful`
    );
    buildSuccessResponse(res, api_name, timestamp, ticket);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const cancelSeat = async (
  req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Cancel Seat", new Date().toISOString()];

  try {
    const ticket = await cancelTicket(req.params.seatNumber);
    logger.info(
      { api_name, seat: ticket.seat_number },
      `${api_name}: Successful`
    );
    buildSuccessResponse(res, api_name, timestamp, ticket);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};

export const resetAllBookings = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const [api_name, timestamp] = ["Booking: Admin Reset", new Date().toISOString()];

  try {
    const data = await resetAllTickets();
    logger.info(
      { api_name, reset_count: data.reset_count },
      `${api_name}: Successful`
    );
    buildSuccessResponse(res, api_name, timestamp, data);
  } catch (error) {
    handleError(error, res, api_name, timestamp);
  }
};
