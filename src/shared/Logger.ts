import fs from 'fs';
import path from 'path';

export class Logger {
    private logFile: string;

    constructor() {
        const logDirectory = path.join(__dirname, '../logs');
        // Ensure the log directory exists
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }

        this.logFile = path.join(logDirectory, 'app.log');
    }

    // Log request details
    logRequest(method: string, url: string, body: any): void {
        const message = `[REQUEST] ${new Date().toISOString()} | Method: ${method} | URL: ${url} | Body: ${JSON.stringify(body)}`;
        this.log(message);
    }

    // Log response details
    logResponse(method: string, url: string, statusCode: number, duration:number): void {
        const message = `[RESPONSE] ${new Date().toISOString()} | Method: ${method} | URL: ${url} | Status: ${statusCode} | Response time: ${duration}ms`;
        this.log(message);
    }

    // Log errors
    logError(error: string): void {
        const message = `[ERROR] ${new Date().toISOString()} | Error: ${error}`;
        this.log(message);
    }

    // Log messages to both file and console
    log(message: string): void {
        console.log(message); // Print to the console
        this.writeToFile(message + '\n'); // Append to file
    }

    // Write logs to the log file
    private writeToFile(message: string): void {
        fs.appendFileSync(this.logFile, message, 'utf8');
    }
}
