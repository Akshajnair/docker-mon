import { Request, Response, NextFunction } from 'express';
import { Logger } from '../shared/Logger';

const logger = new Logger();

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now(); // Track time to calculate response duration later

    // Log the incoming request
    logger.logRequest(req.method, req.url, req.body);

    // Listen for the response to finish so we can log the response details
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.logResponse(req.method, req.url, res.statusCode,duration);
    });

    next(); // Call next middleware or controller
};
