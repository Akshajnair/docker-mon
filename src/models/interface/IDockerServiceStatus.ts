
export default interface IDockerServiceStatus {
  name: string;
  containerId: string;
  state: string;
  status: string;
}
