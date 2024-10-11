import { Request, Response, NextFunction } from 'express';

// Custom error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.message}`);

    // If the error has a status code, use it; otherwise, default to 500
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Hide stack in production
    });
};

export default errorHandler;
