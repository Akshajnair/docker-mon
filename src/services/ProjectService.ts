import { getAllProject, getProject, newProject, updateProjectDockerCompose, updateProjectName } from "../dataAccess/ProjectDataAccess"
import IDockerCompose from "../models/interface/IDockerCompose"

function getAllProjectList() {
    return getAllProject()
}

function getProjectDetails(folderName: string) {
    return getProject(folderName)
}

function addProject(projectName: string) {
    return newProject(projectName)
}

function renameProject(projectName: string, newProjectName: string) {
    return updateProjectName(projectName, newProjectName)
}

function updateProject(projectName: string, projectDockerCompose: IDockerCompose) {
    return updateProjectDockerCompose(projectName, projectDockerCompose)
}

export { getAllProjectList, getProjectDetails, addProject, renameProject, updateProject }