import IHealthCheckConfig from "./interface/IHealthCheckConfig";

export class HealthCheckConfig implements IHealthCheckConfig {
    test: string[];
    interval?: string;
    timeout?: string;
    retries?: number;
    start_period?: string;

    constructor(
        test: string[],
        interval?: string,
        timeout?: string,
        retries?: number,
        start_period?: string
    ) {
        this.test = test;
        this.interval = interval;
        this.timeout = timeout;
        this.retries = retries;
        this.start_period = start_period;
    }
}