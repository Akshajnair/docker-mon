import DockerCompose from "./IDockerCompose";

export default interface IDockerProject {
    name: string;
    folderName: string;
    dockerCompose?: DockerCompose;
}