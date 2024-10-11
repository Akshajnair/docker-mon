import { getAllProject, getProject } from "../dataAccess/ProjectDataAccess"

function getAllProjectList() {
    return getAllProject()
}

function getProjectDetails(folderName: string) {
    return getProject(folderName)
}

export { getAllProjectList, getProjectDetails }