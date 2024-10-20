import { Router, Request, Response, NextFunction } from 'express';
import { getAllServices, getAllServiceStatus } from '../services/DockerService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const services = getAllServices()
  res.json(services)
});

router.get('/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const servicesStatus = await getAllServiceStatus();
    res.json(servicesStatus)
  }
  catch (err) {
    next(err)
  }
});

export default router;
