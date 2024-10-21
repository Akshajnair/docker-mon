import fs from 'fs';
import { BASE_DIR } from '../shared/Constants';
import { getAllFilesFolderInDirectory } from '../shared/utils/FileUtilities';
import IDockerProject from '../models/interface/IDockerProject';
import { deserializeFolderName, serializeFolderName } from '../shared/utils/StringUtilities';
import NotFoundError from '../errors/NotFoundError';
import AlreadyExistsError from '../errors/AlreadyExistsError';
import { createProjectYaml, getProjectYaml } from './YamlDataAccess';
import IDockerProjectSummary from '../models/interface/IDockerProjectSummary';

function getAllProject(): IDockerProjectSummary[] {
    const results: IDockerProjectSummary[] = [];
    const folders = getAllFilesFolderInDirectory()
    folders.forEach((folder) => {
        if (hasDockerComposeFile(folder)) {
            const dockerProject: IDockerProjectSummary = {
                name: deserializeFolderName(folder),
                folderName: folder
            }
            results.push(dockerProject)
        }
    })
    return results;
};

function getProject(projectFolder: string): IDockerProject {
    if (hasDockerComposeFile(projectFolder)) {
        const dockerProject: IDockerProject = {
            name: deserializeFolderName(projectFolder),
            folderName: projectFolder,
            dockerCompose: getProjectYaml(`${BASE_DIR}/${projectFolder}/docker-compose.yml`)
        }
        return dockerProject;
    }
    throw new NotFoundError("Folder not found.");
};

function newProject(projectName: string): boolean {
    const serializedProjectName = serializeFolderName(projectName);
    if (!fs.existsSync(`${BASE_DIR}/${serializedProjectName}`)) {
        try {
            fs.mkdirSync(`${BASE_DIR}/${serializedProjectName}`, { recursive: true });
            console.log(`Folder created at ${BASE_DIR}/${serializedProjectName}`);
            createProjectYaml(serializedProjectName);
        } catch (err) {
            throw ('Error creating Project');
        }
        return true;
    }
    throw new AlreadyExistsError("Project already exist.");
};

function deleteProject() { }
function updateProject() { }

// Private Methods
function hasDockerComposeFile(projectFolder: string): boolean {
    if (fs.existsSync(`${BASE_DIR}/${projectFolder}`)) {
        const stats = fs.statSync(`${BASE_DIR}/${projectFolder}`);
        if (stats.isDirectory()) {
            const files = getAllFilesFolderInDirectory(`${BASE_DIR}/${projectFolder}`);
            return files.includes('docker-compose.yml')
        } else {
            return false;
        }
    }
    throw new NotFoundError("Folder not found.");
}


export { getAllProject, getProject, newProject };