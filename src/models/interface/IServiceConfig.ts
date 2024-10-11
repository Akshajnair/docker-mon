import { IBuildConfig } from "./IBuildConfig";
import IHealthCheckConfig from "./IHealthCheckConfig";
import { ILoggingConfig } from "./ILoggingConfig";

export default interface IServiceConfig {
    image?: string;
    build?: IBuildConfig;
    container_name?: string;
    volumes?: string[];
    ports?: string[];
    environment?: { [key: string]: string };
    depends_on?: string[];
    networks?: string[];
    restart?: 'no' | 'always' | 'on-failure' | 'unless-stopped';
    healthcheck?: IHealthCheckConfig;
    logging?: ILoggingConfig;
}