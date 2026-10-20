import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import prisma from "../../../shared/prisma";

/**
 * Health probes used by Docker HEALTHCHECK, blue/green deploys, load balancers,
 * and the mobile clients' connectivity indicator.
 *
 *   GET /health        → liveness (process is up)
 *   GET /health/live   → liveness alias
 *   GET /health/ready  → readiness (process is up AND database answers)
 */
const router = Router();

const basePayload = () => ({
  timestamp: new Date().toISOString(),
  uptime: Math.round(process.uptime()),
  version: process.env.APP_VERSION || "dev"
});

const live = (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, message: "API is live", ...basePayload() });
};

router.get("/", live);
router.get("/live", live);

router.get("/ready", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      message: "API is ready",
      database: "up",
      ...basePayload()
    });
  } catch {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      message: "Database unavailable",
      database: "down",
      ...basePayload()
    });
  }
});

export const HealthRoutes = router;
