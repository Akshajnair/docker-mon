import { exec } from "child_process";
import { getAllProject } from "../dataAccess/ProjectDataAccess";
import DockerError from "../errors/DockerError";
import IDockerServiceStatus from "../models/interface/IDockerServiceStatus";
import { ServiceConfig } from "../models/ServiceConfig";
import { Logger } from "../shared/Logger";
import { getProjectDetails } from "./ProjectService";
import Docker from "dockerode";
import si from "systeminformation";
import ContainerStateEnum from "../models/enums/ContainerStateEnum";

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
          state:
            container?.State || ContainerStateEnum[ContainerStateEnum.exited],
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

async function getBasicSystemInfo() {
  try {
    // Get memory data
    const memoryData = await si.mem();
    const totalMemory = (memoryData.total / (1024 * 1024 * 1024)).toFixed(2); // in GB
    const usedMemory = (
      (memoryData.total - memoryData.available) /
      (1024 * 1024 * 1024)
    ).toFixed(2); // in GB
    const freeMemory = (memoryData.available / (1024 * 1024 * 1024)).toFixed(2); // in GB

    // Get CPU data
    const cpuLoad = await si.currentLoad();
    const cpuUsage = cpuLoad.currentLoad.toFixed(2); // in percentage

    // Get storage data
    // const diskData = await si.fsSize();
    // const storageUsage = diskData.map((disk: any) => ({
    //   fs: disk.fs,
    //   total: (disk.size / (1024 * 1024 * 1024)).toFixed(2), // in GB
    //   used: (disk.used / (1024 * 1024 * 1024)).toFixed(2), // in GB
    //   usage: `${disk.use.toFixed(2)}%`,
    // }));
    const fsSizes = await si.fsSize();

    // Get detailed mount info using 'df -h'
    exec("df -h", (error, stdout) => {
      if (error) {
        console.error("Error executing df command:", error);
        return;
      }
      console.log(stdout);
      const lines = stdout.split("\n").slice(1); // Skip the header line
      const parsedData = lines
        .map((line) => {
          const parts = line.split(/\s+/);
          if (parts.length >= 6) {
            return {
              fs: parts[0],
              size: parts[1],
              used: parts[2],
              available: parts[3],
              usage: parts[4],
              mountedOn: parts[5],
            };
          }
          return null;
        })
        .filter(Boolean);
      console.log("Filtered mount information:", parsedData);
    });
    const storageUsage = fsSizes.map((fs) => ({
      mountPoint: fs.fs,
      total: (fs.size / 1024 ** 3).toFixed(2) + " GB",
      used: (fs.used / 1024 ** 3).toFixed(2) + " GB",
      usage: `${fs.use.toFixed(2)}%`,
    }));

    // Get network data
    const networkStats = await si.networkStats();
    const networkUsage = networkStats.map((net: any) => ({
      iface: net.iface,
      rx: (net.rx_sec / (1024 * 1024)).toFixed(2), // in MB/sec
      tx: (net.tx_sec / (1024 * 1024)).toFixed(2), // in MB/sec
    }));

    return {
      memory: {
        total: `${totalMemory} GB`,
        used: `${usedMemory} GB`,
        free: `${freeMemory} GB`,
      },
      cpu: {
        usage: `${cpuUsage}%`,
      },
      storage: storageUsage,
      network: networkUsage,
    };
  } catch (error) {
    console.error("Error fetching system information:", error);
    throw new Error("Failed to get system information");
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

export {
  getAllServiceStatus,
  getAllServices,
  getContainerStats,
  getBasicSystemInfo,
};
