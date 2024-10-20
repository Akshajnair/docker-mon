export default class DockerError extends Error {
    status: number;

    constructor(message?: string) {
        super(message);
        this.name = 'DockerError';
        this.status = 500; // Set the status code
    }
}

module.exports = DockerError;