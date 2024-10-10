import express from 'express';
import path from 'path';
import 'dotenv/config'
import { checkAndCreateBaseFolder } from './shared/utils/fileUtilities';

import fileController from './controllers/FileController';
import pingController from './controllers/PingController';

// init app
const app = express();
app.use(express.json());
checkAndCreateBaseFolder();
app.use(express.static(path.join(__dirname, '../frontend/build')));

// init Controllers
app.use('/api/ping', pingController);
app.use('/api/files', fileController);


// Catch-all route to serve the React app for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

export default app;