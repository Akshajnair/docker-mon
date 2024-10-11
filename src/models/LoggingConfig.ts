import { ILoggingConfig } from "./interface/ILoggingConfig";

export class LoggingConfig implements ILoggingConfig {
    driver: string;
    options?: { [key: string]: string };

    constructor(driver: string, options?: { [key: string]: string }) {
        this.driver = driver;
        this.options = options;
    }
}