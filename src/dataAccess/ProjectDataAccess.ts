import fs from 'fs';
import { BASE_DIR } from '../shared/Constants';
import { getAllFilesFolderInDirectory } from '../shared/utils/FileUtilities';
import DockerProject from '../models/interface/IDockerProject';
import { deserializeFolderName } from '../shared/utils/stringUtilities';
import NotFoundError from '../errors/NotFoundError';
import { getProjectYaml } from './YamlDataAccess';

function getAllProject(): DockerProject[] {
    const results: DockerProject[] = [];
    const folders = getAllFilesFolderInDirectory()
    folders.forEach((folder) => {
        const stats = fs.statSync(`${BASE_DIR}/${folder}`);

        if (stats.isDirectory()) {
            const files = getAllFilesFolderInDirectory(`${BASE_DIR}/${folder}`)

            if (files.includes('docker-compose.yml')) {
                const dockerProject: DockerProject = {
                    name: deserializeFolderName(folder),
                    folderName: folder
                }
                results.push(dockerProject)
            }
        }
    })
    return results;
};

function getProject(projectFolder: string): DockerProject {

    if (fs.existsSync(`${BASE_DIR}/${projectFolder}`)) {
        const files = getAllFilesFolderInDirectory(`${BASE_DIR}/${projectFolder}`);
        if (files.includes('docker-compose.yml')) {
            const dockerProject: DockerProject = {
                name: deserializeFolderName(projectFolder),
                folderName: projectFolder,
                dockerCompose: getProjectYaml(`${BASE_DIR}/${projectFolder}/docker-compose.yml`)
            }
            return dockerProject;
        }
    }
    throw new NotFoundError("Folder not found.");
};



function deleteProject() { }
function updateProject() { }


export { getAllProject, getProject };