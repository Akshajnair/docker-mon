
import fs from 'fs';
import NotFoundError from '../errors/NotFoundError';
import * as yaml from 'js-yaml';
import DockerCompose from '../models/DockerCompose';
import IDockerCompose from '../models/interface/IDockerCompose';
import { BASE_DIR } from '../shared/Constants';
import { Logger } from '../shared/Logger';

const logger = Logger.getInstance();

function getProjectYaml(yamlLocation: string): DockerCompose {
    logger.info(`Attempting to read YAML file from location: ${yamlLocation}`);

    if (fs.existsSync(yamlLocation)) {
        try {
            const fileContents = fs.readFileSync(yamlLocation, 'utf8');
            logger.info(`Successfully read the YAML file from: ${yamlLocation}`);

            const data = yaml.load(fileContents) as DockerCompose;
            logger.info(`Successfully parsed YAML file at: ${yamlLocation}`);

            return new DockerCompose(data.services, data.volumes, data.networks);
        } catch (error) {
            logger.error(`Error reading or parsing YAML file: ${error}`);
            throw error;
        }
    }
    logger.error(`YAML file not found at location: ${yamlLocation}`);
    throw new NotFoundError("YAML file not found.");
};

function updateProjectYaml(yamlLocation: string, updatedDockerCompose: IDockerCompose): void {
    logger.info(`Attempting to update YAML file at location: ${yamlLocation}`);

    if (fs.existsSync(yamlLocation)) {
        try {
            const dockerCompose = new DockerCompose(updatedDockerCompose.services, updatedDockerCompose.volumes, updatedDockerCompose.networks);
            const yamlStr = yaml.dump(dockerCompose);
            fs.writeFileSync(yamlLocation, yamlStr, 'utf8');
            logger.info(`Successfully updated YAML file at location: ${yamlLocation}`);
        } catch (error) {
            logger.error(`Error writing YAML file: ${error}`);
            throw error;
        }
    } else {
        logger.error(`YAML file not found at location: ${yamlLocation}`);
        throw new NotFoundError("YAML file not found.");
    }
};

function createProjectYaml(projectFolderName: string): void {
    const projectFolderPath = `${BASE_DIR}/${projectFolderName}`;

    logger.info(`Attempting to create docker-compose.yml for project: ${projectFolderName}`);

    try {
        // Ensure the directory exists before creating the yaml file
        if (!fs.existsSync(projectFolderPath)) {
            logger.error(`Project folder ${projectFolderPath} not found.`);
            throw new Error(`Project folder ${projectFolderPath} does not exist.`);
        }

        const newDockerCompose = new DockerCompose({});
        const yamlStr = yaml.dump(newDockerCompose);

        fs.writeFileSync(`${projectFolderPath}/docker-compose.yml`, yamlStr, 'utf8');
        logger.info(`Successfully created docker-compose.yml for project: ${projectFolderName}`);
    } catch (error) {
        logger.error(`Error creating docker-compose.yml for project ${projectFolderName}: ${error}`);
        throw error;
    }
};

function renameProjectYaml(projectFolderNewName: string): void {
    const projectYamlPath = `${BASE_DIR}/${projectFolderNewName}/docker-compose.yml`;

    logger.info(`Attempting to rename services in docker-compose.yml for project: ${projectFolderNewName}`);

    try {
        // Check if the project YAML file exists
        if (!fs.existsSync(projectYamlPath)) {
            logger.error(`docker-compose.yml not found for project ${projectFolderNewName}`);
            throw new Error(`docker-compose.yml not found in project folder: ${projectFolderNewName}`);
        }

        // Load the current YAML file
        const dockerCompose = getProjectYaml(projectYamlPath);

        // Rename each container's name in the services section
        Object.keys(dockerCompose.services).forEach((container) => {
            dockerCompose.services[container].container_name = `${projectFolderNewName}_${container}`;
        });

        // Dump the updated YAML object to a string
        const yamlStr = yaml.dump(dockerCompose);

        // Write the updated YAML back to the file
        fs.writeFileSync(projectYamlPath, yamlStr, 'utf8');

        logger.info(`Successfully renamed services in docker-compose.yml for project: ${projectFolderNewName}`);
    } catch (error) {
        logger.error(`Error renaming docker-compose.yml for project ${projectFolderNewName}: ${error}`);
        throw error;
    }
};

export { getProjectYaml, updateProjectYaml, createProjectYaml, renameProjectYaml }