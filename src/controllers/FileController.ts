import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// Handle a GET request to list all files
router.get('/', (req: Request, res: Response) => {
  const directoryPath = process.env.BASE_DIR || path.join(__dirname, '../../files');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to scan directory' });
    }

    res.json({ files });
  });
});

// Handle a GET request to read a specific file
router.get('/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(process.env.BASE_DIR || path.join(__dirname, '../../files'), filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ content: data });
  });
});

export default router;
