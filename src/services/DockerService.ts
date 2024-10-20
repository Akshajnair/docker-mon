import { getAllProject } from "../dataAccess/ProjectDataAccess"
import DockerError from "../errors/DockerError";
import { ServiceConfig } from "../models/ServiceConfig";
import { getProjectDetails } from "./ProjectService";
import Docker from 'dockerode';

async function getAllServiceStatus() {
    const allService = getAllServices();
    const docker = new Docker();

    try {
        // List all containers (both running and stopped)
        const containers = await docker.listContainers({ all: true });

        return allService.map((service) => {
            const container = containers.find(
                (container) => container.Names[0].replace(/^\//, '') === service.container_name
            );
            return {
                name: service.container_name,
                state: container?.State || "Stopped",
                status: container?.Status || "Stopped",
            };
        });
    } catch (error) {
        throw new DockerError("Error connecting with docker");
    }
}


function getAllServices() {

    const dockerService: ServiceConfig[] = []
    const allProject = getAllProject();

    allProject.forEach((project) => {
        const details = getProjectDetails(project.folderName);
        Object.entries(details.dockerCompose.services).forEach(([container, containerConfig]) => {
            dockerService.push(containerConfig);
        })
    })

    return dockerService;
}


export { getAllServiceStatus, getAllServices }