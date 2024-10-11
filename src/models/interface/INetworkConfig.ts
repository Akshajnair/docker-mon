export default interface INetworkConfig {
    driver?: string;
    driver_opts?: { [key: string]: string };
    external?: boolean | { name: string };
}