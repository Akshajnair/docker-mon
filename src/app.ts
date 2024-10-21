import express from 'express';
import path from 'path';
import 'dotenv/config'
import { checkAndCreateBaseFolder } from './shared/utils/FileUtilities';
import errorHandler from './middleware/ErrorHandlerMiddleware';
import { loggerMiddleware } from './middleware/LoggingMiddleware';

// Controllers
import fileController from './controllers/FileController';
import pingController from './controllers/PingController';
import dockerController from './controllers/DockerController';
import projectController from './controllers/ProjectController';



// init app
const app = express();
app.use(express.json());
checkAndCreateBaseFolder();
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Use Logger Middleware
app.use(loggerMiddleware);

// init Controllers
app.use('/api/ping', pingController);
app.use('/api/docker', dockerController);
app.use('/api/Project', projectController);
app.use('/api/files', fileController);


// Catch-all route to serve the React app for any other requests
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handling middleware (should come after all other routes)
app.use(errorHandler);

export default app;