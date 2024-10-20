import { getAllProject, getProject, newProject } from "../dataAccess/ProjectDataAccess"

function getAllProjectList() {
    return getAllProject()
}

function getProjectDetails(folderName: string) {
    return getProject(folderName)
}

function addProject(projectName: string) {
    return newProject(projectName)
}

export { getAllProjectList, getProjectDetails, addProject }