import { NextFunction, Request, Response } from "express";
import ICreateProject from "../models/interface/ICreateProject";
import { INVALID_NAME_REGEX } from "../shared/Constants";
import { Logger } from "../shared/Logger";

const logger = Logger.getInstance();

export default function createProjectValidator(req: Request<{}, {}, ICreateProject>, res: Response, next: NextFunction) {
    const { projectName } = req.body;

    logger.info('Validating project name in createProjectValidator');

    // Check if projectName is provided, has a valid length, and doesn't contain invalid characters
    if (!projectName) {
        logger.error('Validation failed: Project name is missing');
        return res.status(400).json({ error: 'Project name is required' });
    }

    if (projectName.length < 5 || projectName.length > 30) {
        logger.error('Validation failed: Project name length is invalid');
        return res.status(400).json({ error: 'Project name must be between 5 and 30 characters long' });
    }

    if (!INVALID_NAME_REGEX.test(projectName)) {
        logger.error('Validation failed: Project name contains invalid characters');
        return res.status(400).json({ error: 'Project name contains invalid characters' });
    }

    logger.info('Project name is valid');
    next();
};