import fs from 'fs';
import { BASE_DIR } from '../Constants';

/**
 * Ensure the files directory exists
 */
function checkAndCreateBaseFolder(): void {
    if (!fs.existsSync(BASE_DIR)) {
        fs.mkdirSync(BASE_DIR, { recursive: true });
    }
}

function getAllFilesFolderInDirectory(dirPath?: string): string[] {
    return fs.readdirSync(dirPath || BASE_DIR);
}

export { checkAndCreateBaseFolder, getAllFilesFolderInDirectory }