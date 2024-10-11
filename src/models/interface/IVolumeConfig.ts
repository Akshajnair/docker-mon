export default interface IVolumeConfig {
    driver?: string;
    driver_opts?: { [key: string]: string };
    external?: boolean | { name: string };
}