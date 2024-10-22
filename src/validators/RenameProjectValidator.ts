import { NextFunction, Request, Response } from "express";
import IRenameProject from "../models/interface/IRenameProject";

export default function renameProjectValidator(req: Request<{}, {}, IRenameProject>, res: Response, next: NextFunction) {
    const { projectName, newProjectName } = req.body;
    const re = /[^<>:"/\|?*(?:aux|con|nul|prn|com[1-9]|lpt[1-9]]/;

    if (!projectName) {
        return res.status(400).json({ error: 'Invalid project Name' });
    }

    if (!newProjectName || newProjectName.length < 5 || newProjectName.length > 30 || !re.test(newProjectName)) {
        return res.status(400).json({ error: 'Invalid new project Name' });
    }

    next();
};