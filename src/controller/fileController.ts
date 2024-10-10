// src/controllers/fileController.ts

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface DirectoryItem {
  name: string;
  type: 'file' | 'directory';
}

const readDirectory = (dirPath: string): DirectoryItem[] => {
  const items: DirectoryItem[] = [];
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      items.push({ name: fullPath, type: 'directory' });
      items.push(...readDirectory(fullPath)); // Recursively read subdirectories
    } else {
      items.push({ name: fullPath, type: 'file' });
    }
  });

  return items;
};

// Controller function to handle requests
export const getFilesAndDirectories = (req: Request, res: Response) => {
  const baseDir = process.env.BASE_DIR || './your-directory';
  
  try {
    const items = readDirectory(baseDir);
    res.json(items); // Return the items as JSON
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
};
