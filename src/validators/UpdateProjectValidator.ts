import { NextFunction, Request, Response } from "express";
import IUpdateProject from "../models/interface/IUpdateProject";
import DockerCompose from "../models/DockerCompose";
import { Logger } from "../shared/Logger";

const logger = Logger.getInstance();

export default function updateProjectValidator(req: Request<{}, {}, IUpdateProject>, res: Response, next: NextFunction) {
    const { projectDockerCompose } = req.body;

    // Log the incoming request for better traceability
    logger.info('Validating projectDockerCompose in updateProjectValidator');

    // Check if the Docker Compose configuration exists
    if (!projectDockerCompose) {
        logger.error('Validation failed: Docker Compose configuration is missing');
        return res.status(400).json({ error: 'Docker Compose configuration is required' });
    }

    try {
        // Validate the structure of Docker Compose configuration
        const dockerCompose = new DockerCompose(
            projectDockerCompose.services,
            projectDockerCompose.volumes,
            projectDockerCompose.networks
        );
        logger.info('Docker Compose configuration is valid');
    } catch (error) {
        logger.error(`Validation failed: Invalid Docker Compose configuration - ${error}`);
        return res.status(400).json({ error: 'Invalid Docker Compose configuration' });
    }

    // If all checks pass, continue to the next middleware
    next();
};