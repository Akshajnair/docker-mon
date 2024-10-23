import path from 'path';

export const BASE_DIR = path.join(__dirname, "../../", process.env.BASE_DIR || 'files'); 

// Regular expression to match invalid characters in filenames
export const INVALID_NAME_REGEX = /[^<>:"/\|?*(?:aux|con|nul|prn|com[1-9]|lpt[1-9]]/;