import INetworkConfig from "./interface/INetworkConfig";

export class NetworkConfig implements INetworkConfig {
    driver?: string;
    driver_opts?: { [key: string]: string };
    external?: boolean | { name: string };

    constructor(
        driver?: string,
        driver_opts?: { [key: string]: string },
        external?: boolean | { name: string }
    ) {
        this.driver = driver;
        this.driver_opts = driver_opts;
        this.external = external;
    }
}