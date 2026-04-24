import { prisma } from "../helpers/prisma.helper";
import { AppError } from "../helpers/app-error.helper";
import { TicketStatus } from "../generated/prisma/enums";

export interface PassengerDetails {
  name: string;
  email: string;
  phone: string;
}

const parseSeatNumber = (raw: unknown): number => {
  const seat = Number(raw);
  if (!Number.isInteger(seat) || seat <= 0) {
    throw new AppError("seat_number must be a positive integer", 400);
  }
  return seat;
};

const requireTicket = async (seatNumber: number) => {
  const ticket = await prisma.ticket.findUnique({
    where: { seat_number: seatNumber },
  });
  if (!ticket) {
    throw new AppError(`Ticket for seat ${seatNumber} not found`, 404);
  }
  return ticket;
};

const validatePassengerDetails = (
  input: Partial<PassengerDetails> | undefined
): PassengerDetails => {
  if (!input) {
    throw new AppError("passenger details are required", 400);
  }
  const name = input.name?.trim();
  const email = input.email?.trim();
  const phone = input.phone?.trim();

  if (!name || !email || !phone) {
    throw new AppError(
      "passenger.name, passenger.email and passenger.phone are required",
      400
    );
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailLooksValid) {
    throw new AppError("passenger.email is not a valid email", 400);
  }

  return { name, email, phone };
};

export const getAllOpenTickets = () => {
  return prisma.ticket.findMany({
    where: { status: TicketStatus.OPEN },
    orderBy: { seat_number: "asc" },
  });
};

export const getAllClosedTickets = () => {
  return prisma.ticket.findMany({
    where: { status: TicketStatus.CLOSED },
    orderBy: { seat_number: "asc" },
  });
};

export const getTicketStatus = async (seatNumberRaw: unknown) => {
  const seatNumber = parseSeatNumber(seatNumberRaw);
  const ticket = await requireTicket(seatNumber);
  return {
    seat_number: ticket.seat_number,
    status: ticket.status,
  };
};

export const getTicketPassenger = async (seatNumberRaw: unknown) => {
  const seatNumber = parseSeatNumber(seatNumberRaw);
  const ticket = await requireTicket(seatNumber);

  if (ticket.status === TicketStatus.OPEN) {
    throw new AppError(
      `Seat ${seatNumber} is not booked - no passenger details`,
      409
    );
  }

  return {
    seat_number: ticket.seat_number,
    status: ticket.status,
    passenger: {
      name: ticket.passenger_name,
      email: ticket.passenger_email,
      phone: ticket.passenger_phone,
    },
    booked_at: ticket.booked_at,
  };
};

export const bookTicket = async (
  seatNumberRaw: unknown,
  passengerInput: Partial<PassengerDetails> | undefined
) => {
  const seatNumber = parseSeatNumber(seatNumberRaw);
  const passenger = validatePassengerDetails(passengerInput);

  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { seat_number: seatNumber },
    });
    if (!ticket) {
      throw new AppError(`Ticket for seat ${seatNumber} not found`, 404);
    }
    if (ticket.status === TicketStatus.CLOSED) {
      throw new AppError(`Seat ${seatNumber} is already booked`, 409);
    }

    return tx.ticket.update({
      where: { seat_number: seatNumber },
      data: {
        status: TicketStatus.CLOSED,
        passenger_name: passenger.name,
        passenger_email: passenger.email,
        passenger_phone: passenger.phone,
        booked_at: new Date(),
      },
    });
  });
};

export const cancelTicket = async (seatNumberRaw: unknown) => {
  const seatNumber = parseSeatNumber(seatNumberRaw);

  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.findUnique({
      where: { seat_number: seatNumber },
    });
    if (!ticket) {
      throw new AppError(`Ticket for seat ${seatNumber} not found`, 404);
    }
    if (ticket.status === TicketStatus.OPEN) {
      throw new AppError(`Seat ${seatNumber} is not currently booked`, 409);
    }

    return tx.ticket.update({
      where: { seat_number: seatNumber },
      data: {
        status: TicketStatus.OPEN,
        passenger_name: null,
        passenger_email: null,
        passenger_phone: null,
        booked_at: null,
      },
    });
  });
};

export const resetAllTickets = async () => {
  const { count } = await prisma.ticket.updateMany({
    data: {
      status: TicketStatus.OPEN,
      passenger_name: null,
      passenger_email: null,
      passenger_phone: null,
      booked_at: null,
    },
  });

  return { reset_count: count };
};
