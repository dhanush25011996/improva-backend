import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  api_name: string;
  timestamp: string;
  data: T;
}

export const buildSuccessResponse = <T = unknown>(
  res: Response,
  api_name: string,
  timestamp: string,
  data: T,
  statusCode: number = 200
): void => {
  const payload: ApiResponse<T> = {
    success: true,
    api_name,
    timestamp,
    data,
  };

  res.status(statusCode).json(payload);
};

export const buildFailedResponse = <T = unknown>(
  res: Response,
  api_name: string,
  timestamp: string,
  data: T,
  statusCode: number = 500
): void => {
  const payload: ApiResponse<T> = {
    success: false,
    api_name,
    timestamp,
    data,
  };

  res.status(statusCode).json(payload);
};
