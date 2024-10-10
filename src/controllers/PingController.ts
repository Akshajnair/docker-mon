import { Router, Request, Response } from 'express';
const router = Router();

// This is be used as a basic health check or to confirm that the server is running.
router.get('/', (req: Request, res: Response) => {
    res.send("pong");
});


export default router;