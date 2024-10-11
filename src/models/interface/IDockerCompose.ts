import INetworkConfig from "./INetworkConfig";
import IServiceConfig from "./IServiceConfig";
import IVolumeConfig from "./IVolumeConfig";

export default interface IDockerCompose {
    services: {
        [serviceName: string]: IServiceConfig;
    };
    volumes?: {
        [volumeName: string]: IVolumeConfig;
    };
    networks?: {
        [networkName: string]: INetworkConfig;
    };
}
