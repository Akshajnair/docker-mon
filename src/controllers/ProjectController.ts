import { Router, Request, Response } from 'express';
import { getAllProjectList, getProjectDetails } from '../services/ProjectService';

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

export default router;
