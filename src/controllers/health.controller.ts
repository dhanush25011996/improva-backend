import { Request, Response } from "express";
import { getHealthStatus } from "../services/health.service";
import {
  buildSuccessResponse,
  buildFailedResponse,
} from "../helpers/response.helper";
import { logger } from "../helpers/logger.helper";

export const healthCheck = (_req: Request, res: Response): void => {
  const [api_name, timestamp] = ["Health Check API", new Date().toISOString()];

  try {
    const data = getHealthStatus();
    logger.info({ api_name, timestamp }, "Health Check API: Successful");
    buildSuccessResponse(res, api_name, timestamp, data);
  } catch (error) {
    logger.error({ api_name, timestamp, err: error }, "Health Check API: Failed");
    buildFailedResponse(res, api_name, timestamp, null);
  }

};
