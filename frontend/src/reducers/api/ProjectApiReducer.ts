// src/features/api/projectsApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from 'shared/Constants';
import IDockerProjectSummary from "@models/interface/IDockerProjectSummary"

export const projectsApi = createApi({
    reducerPath: 'projectsApi',  // Unique name for this API slice
    baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
    endpoints: (builder) => ({
        getProjects: builder.query<IDockerProjectSummary[], void>({
            query: () => 'project',
        }),
        getProjectDetails: builder.query({
            query: (folderName: string) => `project/${folderName}`,
        }),
        createProject: builder.mutation({
            query: (newProject) => ({
                url: 'project',
                method: 'POST',
                body: newProject,
            }),
        }),
        updateProject: builder.mutation({
            query: ({ id, ...updatedData }) => ({
                url: `project/${id}`,
                method: 'PUT',
                body: updatedData,
            }),
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `project/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetProjectsQuery,
    useGetProjectDetailsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} = projectsApi;
