export interface ILoggingConfig {
    driver: string; // Mandatory
    options?: { [key: string]: string };
}