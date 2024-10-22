import { NextFunction, Request, Response } from "express";
import ICreateProject from "../models/interface/ICreateProject";

export default function createProjectValidator(req: Request<{}, {}, ICreateProject>, res: Response, next: NextFunction) {
    const { projectName } = req.body;
    const re = /[^<>:"/\|?*(?:aux|con|nul|prn|com[1-9]|lpt[1-9]]/;
    
    if (!projectName || projectName.length < 5 || projectName.length > 30 || !re.test(projectName)) {
        return res.status(400).json({ error: 'Invalid project Name' });
    }

    next();
};