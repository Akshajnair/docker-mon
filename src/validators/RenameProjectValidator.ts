import { NextFunction, Request, Response } from "express";
import IRenameProject from "../models/interface/IRenameProject";
import { Logger } from "../shared/Logger";
import { INVALID_NAME_REGEX } from "../shared/Constants";

const logger = Logger.getInstance();

export default function renameProjectValidator(req: Request<{}, {}, IRenameProject>, res: Response, next: NextFunction) {
    const { newProjectName } = req.body;

    logger.info('Validating new project name in renameProjectValidator');

    // Check if newProjectName is provided, has a valid length, and doesn't contain invalid characters
    if (!newProjectName) {
        logger.error('Validation failed: Project name is missing');
        return res.status(400).json({ error: 'Project name is required' });
    }

    if (newProjectName.length < 5 || newProjectName.length > 30) {
        logger.error('Validation failed: Project name length is invalid');
        return res.status(400).json({ error: 'Project name must be between 5 and 30 characters long' });
    }

    if (!INVALID_NAME_REGEX.test(newProjectName)) {
        logger.error('Validation failed: Project name contains invalid characters');
        return res.status(400).json({ error: 'Project name contains invalid characters' });
    }

    logger.info('Project name is valid');
    next();
};