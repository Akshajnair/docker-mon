export default class NotFoundError extends Error {
    status: number;

    constructor(message?: string) {
        super(message);
        this.name = 'NotFoundError';
        this.status = 404; // Set the status code
    }
}

module.exports = NotFoundError;