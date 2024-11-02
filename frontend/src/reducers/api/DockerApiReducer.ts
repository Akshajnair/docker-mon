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
  }),
});

export const { useGetStatusQuery } = dockerApi;
