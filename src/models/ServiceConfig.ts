import { BuildConfig } from "./BuildConfig";
import { HealthCheckConfig } from "./HealthCheckConfig";
import IServiceConfig from "./interface/IServiceConfig";
import { LoggingConfig } from "./LoggingConfig";

export class ServiceConfig implements IServiceConfig {
    image?: string;
    build?: BuildConfig;
    container_name?: string;
    volumes?: string[];
    ports?: string[];
    environment?: { [key: string]: string };
    depends_on?: string[];
    networks?: string[];
    restart?: 'no' | 'always' | 'on-failure' | 'unless-stopped';
    healthcheck?: HealthCheckConfig;
    logging?: LoggingConfig;

    constructor(
        image?: string,
        build?: BuildConfig,
        container_name?: string,
        volumes?: string[],
        ports?: string[],
        environment?: { [key: string]: string },
        depends_on?: string[],
        networks?: string[],
        restart?: 'no' | 'always' | 'on-failure' | 'unless-stopped',
        healthcheck?: HealthCheckConfig,
        logging?: LoggingConfig
    ) {
        this.image = image;
        this.build = build ? new BuildConfig(build.context, build.dockerfile, build.args, build.target) : undefined;
        this.container_name = container_name;
        this.volumes = volumes;
        this.ports = ports;
        this.environment = environment;
        this.depends_on = depends_on;
        this.networks = networks;
        this.restart = restart;
        this.healthcheck = healthcheck ? new HealthCheckConfig(healthcheck.test, healthcheck.interval, healthcheck.timeout, healthcheck.retries, healthcheck.start_period) : undefined;
        this.logging = logging ? new LoggingConfig(logging.driver, logging.options) : undefined;
    }
}