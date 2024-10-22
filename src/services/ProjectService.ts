import { getAllProject, getProject, newProject, updateProjectName } from "../dataAccess/ProjectDataAccess"

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

export { getAllProjectList, getProjectDetails, addProject, renameProject }