import { Router, Request, Response, NextFunction } from "express";
import {
  getAllServices,
  getAllServiceStatus,
  getBasicSystemInfo,
  getContainerStats,
  startContainer,
  stopContainer,
} from "../services/DockerService";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const services = getAllServices();
  res.json(services);
});

router.get(
  "/status",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servicesStatus = await getAllServiceStatus();
      res.json(servicesStatus);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/resourceMonitor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const containerResource = await getBasicSystemInfo();
      res.json(containerResource);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/resourceMonitor/:containerId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { containerId } = req.params;
      const containerResource = await getContainerStats(containerId);
      res.json(containerResource);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:containerId/stop",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { containerId } = req.params;
      await stopContainer(containerId);
      res.json(true);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:containerId/start",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { containerId } = req.params;
      await startContainer(containerId);
      res.json(true);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
