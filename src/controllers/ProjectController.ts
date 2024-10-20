import { Router, Request, Response } from 'express';
import { addProject, getAllProjectList, getProjectDetails } from '../services/ProjectService';
import validateUserData from '../validators/CreateProjectValidator';

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

router.post('/create', validateUserData, (req: Request, res: Response) => {
  const { projectName } = req.body;
  if (addProject(projectName)) {
    res.status(201).json("Project Created successfully.")
  }
});

export default router;
