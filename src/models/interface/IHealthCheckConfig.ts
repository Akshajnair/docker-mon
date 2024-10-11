export default interface IHealthCheckConfig {
    test: string[];
    interval?: string;
    timeout?: string;
    retries?: number;
    start_period?: string;
}