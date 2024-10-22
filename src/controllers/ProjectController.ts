import { Router, Request, Response } from 'express';
import { addProject, getAllProjectList, getProjectDetails, renameProject } from '../services/ProjectService';
import createProjectValidator from '../validators/CreateProjectValidator';
import renameProjectValidator from '../validators/RenameProjectValidator';

const router = Router();


// Handle a GET request to list all files
router.get('/', (req: Request, res: Response) => {
  res.json(getAllProjectList())
});

// Handle a GET request to get project details
router.get('/:folderName', (req: Request, res: Response) => {
  const { folderName } = req.params;
  res.json(getProjectDetails(folderName))
});

router.post('/create', createProjectValidator, (req: Request, res: Response) => {
  const { projectName } = req.body;
  if (addProject(projectName)) {
    res.status(201).json("Project Created successfully.")
  }
});

router.post('/rename', renameProjectValidator, (req: Request, res: Response) => {
  const { projectName, newProjectName } = req.body;
  if (renameProject(projectName, newProjectName)) {
    res.status(201).json("Project Renamed successfully.")
  }
});

export default router;
