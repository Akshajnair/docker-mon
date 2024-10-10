import express from 'express';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'
import { getFilesAndDirectories } from './controller/fileController';

const app = express();

app.use(express.json());

// Use environment variables with fallback defaults
const PORT = process.env.PORT || 3000;
const BASE_DIR = path.resolve(__dirname, "../", process.env.BASE_DIR || 'files');
console.log(process.env.BASE_DIR,BASE_DIR)

// Ensure the files directory exists
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
}

// Read a file
app.get('/read/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, BASE_DIR, filename);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: `Error reading file: ${err.message}` });
        }
        res.json({ content: data });
    });
});
app.get('/api/files', getFilesAndDirectories);

// Write to a file
app.post('/write', (req, res) => {
    const { filename, content } = req.body;
    const filepath = path.join(__dirname, BASE_DIR, filename);

    fs.writeFile(filepath, content, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: `Error writing to file: ${err.message}` });
        }
        res.json({ message: `File '${filename}' written successfully!` });
    });
});

app.get('/', (req, res) => {
    res.send("Docker-mon is running.")
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
