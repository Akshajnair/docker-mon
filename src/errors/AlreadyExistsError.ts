export default class AlreadyExistsError extends Error {
    status: number;

    constructor(message?: string) {
        super(message);
        this.name = 'Already Exists';
        this.status = 400;
    }
}

module.exports = AlreadyExistsError;