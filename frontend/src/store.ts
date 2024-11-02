import { configureStore } from '@reduxjs/toolkit';
import userPreference from './reducers/UserPreferenceReducer';
import { projectsApi } from './reducers/api/ProjectApiReducer';
import { errorHandlingMiddleware } from 'middleware/errorHandlingMiddleware';
import { dockerApi } from 'reducers/api/DockerApiReducer';

export const store = configureStore({
  reducer: {
    userPreference,
    projectsApi: projectsApi.reducer,
    dockerApi: dockerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectsApi.middleware,
      dockerApi.middleware,
      errorHandlingMiddleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
