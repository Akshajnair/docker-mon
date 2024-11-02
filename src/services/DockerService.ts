import { getAllProject } from "../dataAccess/ProjectDataAccess";
import DockerError from "../errors/DockerError";
import IDockerServiceStatus from "../models/interface/IDockerServiceStatus";
import { ServiceConfig } from "../models/ServiceConfig";
import { Logger } from "../shared/Logger";
import { getProjectDetails } from "./ProjectService";
import Docker from "dockerode";

const logger = Logger.getInstance();

async function getAllServiceStatus(): Promise<IDockerServiceStatus[]> {
  const allService = getAllServices();
  const docker = new Docker();

  logger.info("Fetching status for all services...");

  try {
    // List all containers (both running and stopped)
    const containers = await docker.listContainers({ all: true });
    logger.info("Successfully fetched containers from Docker.");

    return allService
      .filter((x) => x.container_name)
      .map((service) => {
        const container = containers.find(
          (container) =>
            container.Names[0].replace(/^\//, "") === service.container_name
        );
        const serviceStatus: IDockerServiceStatus = {
          name: service.container_name || "",
          containerId: container?.Id || "",
          state: container?.State || "Stopped",
          status: container?.Status || "Stopped",
        };

        logger.info(
          `Service: ${service.container_name}, State: ${serviceStatus.state}, Status: ${serviceStatus.status}`
        );

        return serviceStatus;
      });
  } catch (error) {
    logger.error(`Error connecting to Docker: ${error}`);
    throw new DockerError("Error connecting with Docker");
  }
}

function getAllServices(): ServiceConfig[] {
  const dockerService: ServiceConfig[] = [];
  const allProject = getAllProject();

  logger.info("Fetching all services from projects...");

  allProject.forEach((project) => {
    logger.info(`Processing project: ${project.folderName}`);
    try {
      const details = getProjectDetails(project.folderName);

      Object.entries(details.dockerCompose.services).forEach(
        ([container, containerConfig]) => {
          logger.info(`Found service: ${container}`);
          dockerService.push(containerConfig);
        }
      );
    } catch (error) {
      logger.error(
        `Error fetching details for project ${project.folderName}: ${error}`
      );
    }
  });

  logger.info(`Total services found: ${dockerService.length}`);
  return dockerService;
}

async function getContainerStats(containerId: string) {
  const docker = new Docker();

  try {
    logger.info(`Fetching stats for container: ${containerId}`);

    const container = docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });

    if (!stats) {
      throw new Error(`No stats found for container: ${containerId}`);
    }

    const cpuUsage = calculateCpuUsage(stats);
    const memoryUsage = stats.memory_stats.usage / (1024 * 1024); // Convert to MB

    logger.info(
      `Container ${containerId} CPU: ${cpuUsage}% | Memory: ${memoryUsage} MB`
    );

    return {
      cpuUsage,
      memoryUsage,
    };
  } catch (error) {
    logger.error(
      `Failed to retrieve stats for container ${containerId}: ${error}`
    );
    throw new Error("Failed to retrieve container stats");
  }
}

function calculateCpuUsage(stats: any): number {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemCpuDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const numberOfCpus = stats.cpu_stats.online_cpus;

  if (systemCpuDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemCpuDelta) * numberOfCpus * 100.0;
  }

  return 0;
}

export { getAllServiceStatus, getAllServices, getContainerStats };
