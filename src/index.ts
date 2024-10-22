import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the port from the environment or default to 3000
const PORT = process.env.BACKEND_PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
