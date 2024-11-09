// src/features/api/projectsApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from 'shared/Constants';
import IDockerServiceStatus from '@models/interface/IDockerServiceStatus';

export const dockerApi = createApi({
  reducerPath: 'dockerApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getStatus: builder.query<IDockerServiceStatus[], void>({
      query: () => 'docker/status',
    }),
    stopContainer: builder.mutation({
      query: (containerId: string) => ({
        url: `docker/${containerId}/stop`,
        method: 'POST',
      }),
    }),
    startContainer: builder.mutation({
      query: (containerId: string) => ({
        url: `docker/${containerId}/start`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetStatusQuery,
  useStopContainerMutation,
  useStartContainerMutation,
} = dockerApi;
