import fs from 'fs';
import { BASE_DIR } from '../Constants';

/**
 * Ensure the files directory exists
 */
export function checkAndCreateBaseFolder(): void {
    if (!fs.existsSync(BASE_DIR)) {
        fs.mkdirSync(BASE_DIR, { recursive: true });
    }
}