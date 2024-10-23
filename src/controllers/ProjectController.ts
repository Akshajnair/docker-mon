import { Router, Request, Response } from 'express';
import { addProject, getAllProjectList, getProjectDetails, renameProject, updateProject } from '../services/ProjectService';
import createProjectValidator from '../validators/CreateProjectValidator';
import renameProjectValidator from '../validators/RenameProjectValidator';
import updateProjectValidator from '../validators/UpdateProjectValidator';

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

router.post('/:folderName/rename', renameProjectValidator, (req: Request, res: Response) => {
  const { newProjectName } = req.body;
  const { folderName } = req.params;
  if (renameProject(folderName, newProjectName)) {
    res.status(201).json("Project Renamed successfully.")
  }
});

router.put('/:folderName', updateProjectValidator, (req: Request, res: Response) => {
  const { projectDockerCompose } = req.body;
  const { folderName } = req.params;
  if (updateProject(folderName, projectDockerCompose)) {
    res.status(201).json("Project Updated successfully.")
  }
});

export default router;
