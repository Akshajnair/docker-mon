import IDockerCompose from "./interface/IDockerCompose";
import { NetworkConfig } from "./NetworkConfig";
import { ServiceConfig } from "./ServiceConfig";
import { VolumeConfig } from "./VolumeConfig";

export default class DockerCompose implements IDockerCompose {
    services: { [serviceName: string]: ServiceConfig };
    volumes?: { [volumeName: string]: VolumeConfig };
    networks?: { [networkName: string]: NetworkConfig };

    constructor(
        services: { [serviceName: string]: ServiceConfig },
        volumes?: { [volumeName: string]: VolumeConfig },
        networks?: { [networkName: string]: NetworkConfig }
    ) {
        this.services = Object.fromEntries(
            Object.entries(services || {}).map(([key, service]) => [key, new ServiceConfig(service.image, service.build, service.container_name, service.volumes, service.ports, service.environment, service.depends_on, service.networks, service.restart, service.healthcheck, service.logging)])
        );
        this.volumes = volumes ? Object.fromEntries(
            Object.entries(volumes || {}).map(([key, volume]) => [key, new VolumeConfig(volume?.driver, volume?.driver_opts, volume?.external)]))
            : undefined;
        this.networks = networks ? Object.fromEntries(
            Object.entries(networks || {}).map(([key, network]) => [key, new NetworkConfig(network.driver, network.driver_opts, network.external)]))
            : undefined;
    }
}