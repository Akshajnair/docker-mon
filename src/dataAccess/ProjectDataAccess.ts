import fs from 'fs';
import { BASE_DIR } from '../shared/Constants';
import { getAllFilesFolderInDirectory } from '../shared/utils/FileUtilities';
import IDockerProject from '../models/interface/IDockerProject';
import { deserializeFolderName, serializeFolderName } from '../shared/utils/StringUtilities';
import NotFoundError from '../errors/NotFoundError';
import AlreadyExistsError from '../errors/AlreadyExistsError';
import { createProjectYaml, getProjectYaml, renameProjectYaml, updateProjectYaml } from './YamlDataAccess';
import IDockerProjectSummary from '../models/interface/IDockerProjectSummary';
import { Logger } from '../shared/Logger';
import IDockerCompose from '../models/interface/IDockerCompose';

const logger = Logger.getInstance();

function getAllProject(): IDockerProjectSummary[] {

    logger.info('Starting to fetch all Docker projects');
    const results: IDockerProjectSummary[] = [];
    const folders = getAllFilesFolderInDirectory()
    folders.forEach((folder) => {
        if (hasDockerComposeFile(folder)) {
            const dockerProject: IDockerProjectSummary = {
                name: deserializeFolderName(folder),
                folderName: folder
            }
            logger.info(`Found Docker project: ${dockerProject.name} in folder: ${folder}`);
            results.push(dockerProject)
        } else {
            logger.info(`No Docker Compose file found in folder: ${folder}`);
        }
    })

    logger.info(`Completed fetching Docker projects. Total found: ${results.length}`);
    return results;
};

function getProject(projectFolder: string): IDockerProject {
    logger.info(`Attempting to retrieve project from folder: ${projectFolder}`);
    if (hasDockerComposeFile(projectFolder)) {
        const dockerProject: IDockerProject = {
            name: deserializeFolderName(projectFolder),
            folderName: projectFolder,
            dockerCompose: getProjectYaml(`${BASE_DIR}/${projectFolder}/docker-compose.yml`)
        }
        logger.info(`Successfully retrieved project: ${dockerProject.name} from folder: ${projectFolder}`);
        return dockerProject;
    }
    logger.error(`Docker Compose file not found in folder: ${projectFolder}`);
    throw new NotFoundError("Folder not found.");
};

function newProject(projectName: string): boolean {
    const serializedProjectName = serializeFolderName(projectName);
    const projectPath = `${BASE_DIR}/${serializedProjectName}`;

    logger.info(`Attempting to create a new project: ${projectName}`);

    if (!fs.existsSync(projectPath)) {
        try {
            fs.mkdirSync(projectPath, { recursive: true });
            createProjectYaml(serializedProjectName);
            logger.info(`Successfully created project: ${projectName} at path: ${projectPath}`);
        } catch (err) {
            logger.error(`Error creating project: ${err}`);
            throw ('Error creating Project');
        }
        return true;
    }
    logger.warn(`Project already exists: ${projectName}`);
    throw new AlreadyExistsError("Project already exist.");
};

function updateProjectName(projectName: string, newProjectName: string) {
    const serializedNewProjectName = serializeFolderName(newProjectName);
    const projectPath = `${BASE_DIR}/${projectName}`;
    const newProjectPath = `${BASE_DIR}/${serializedNewProjectName}`;

    logger.info(`Attempting to rename project from ${projectName} to ${newProjectName}`);

    if (fs.existsSync(projectPath)) {
        if (fs.existsSync(newProjectPath)) {
            logger.warn(`New project name already exists: ${newProjectName}`);
            throw new AlreadyExistsError("Project name already exists.");
        }

        try {
            fs.renameSync(projectPath, newProjectPath);
            renameProjectYaml(serializedNewProjectName);
            logger.info(`Successfully renamed project from ${projectName} to ${newProjectName}`);
            return true;
        } catch (err) {
            logger.error(`Error renaming project: ${err}`);
            throw new Error('Error renaming Project');
        }
    }

    logger.error(`Project not found for renaming: ${projectName}`);
    throw new Error('Project not found.');
}

function deleteProject() { }
function updateProjectDockerCompose(projectFolderName: string, projectDockerCompose: IDockerCompose) {
    const projectYamlPath = `${BASE_DIR}/${projectFolderName}/docker-compose.yml`;

    logger.info(`Attempting to update docker-compose.yml for project: ${projectFolderName}`);

    try {
        // Update the YAML file with the new Docker Compose structure
        updateProjectYaml(projectYamlPath, projectDockerCompose);

        logger.info(`Successfully updated docker-compose.yml for project: ${projectFolderName}`);
        return true;
    } catch (error) {
        logger.error(`Error updating docker-compose.yml for project ${projectFolderName}: ${error}`);
        throw error; // Rethrow the error for further handling
    }
}


// Private Methods
function hasDockerComposeFile(projectFolder: string): boolean {
    const projectPath = `${BASE_DIR}/${projectFolder}`;

    logger.info(`Checking for Docker Compose file in folder: ${projectPath}`);

    if (fs.existsSync(projectPath)) {
        const stats = fs.statSync(projectPath);
        if (stats.isDirectory()) {
            const files = getAllFilesFolderInDirectory(projectPath);
            return files.includes('docker-compose.yml')
        } else {
            return false;
        }
    }

    logger.error(`Folder not found: ${projectPath}`);
    throw new NotFoundError("Folder not found.");
}


export { getAllProject, getProject, newProject, updateProjectName, updateProjectDockerCompose };