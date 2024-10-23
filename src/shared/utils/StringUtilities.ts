import InvalidInputError from "../../errors/InvalidInputError";

/**
 * Serializes a folder nameby replacing spaces with dashes ('-').
 * 
 * @param input - The original string with spaces (e.g. "hi my name is yolo").
 * @returns A string with spaces replaced by dashes (e.g. "hi-my-name-is-yolo").
 */
function serializeFolderName(input: string): string {
    if (!input || typeof input !== 'string') {
        throw new InvalidInputError('Invalid folder name provided');
    }
    return input.split(' ').join('-');
}

/**
 * Deserializes a string by replacing dashes ('-') with spaces.
 * 
 * @param input - The string with dashes (e.g. "hi-my-name-is-yolo").
 * @returns A string with dashes replaced by spaces (e.g. "hi my name is yolo").
 */
function deserializeFolderName(input: string): string {
    if (!input || typeof input !== 'string') {
        throw new InvalidInputError('Invalid folder name provided');
    }
    return input.split('-').join(' ');
}

export { serializeFolderName, deserializeFolderName }