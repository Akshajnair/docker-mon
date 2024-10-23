export default class InvalidInputError extends Error {
    status: number;

    constructor(message?: string) {
        super(message);
        this.name = 'InvalidInputError';
        this.status = 400; // Set the status code
    }
}

module.exports = InvalidInputError;