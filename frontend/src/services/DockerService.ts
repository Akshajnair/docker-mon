import IDockerServiceStatus from '@models/interface/IDockerServiceStatus';
import { dockerApi } from 'reducers/api/DockerApiReducer';
import ProjectStateEnum from 'shared/enums/ProjectStatesEnums';
import { store } from 'store'; // Your Redux store

function startDockerStatusPolling() {
  store.dispatch(
    dockerApi.endpoints.getStatus.initiate(undefined, {
      subscriptionOptions: { pollingInterval: 1000 },
    }),
  );
}

function getProjectStatus(
  containers: string[],
  status: IDockerServiceStatus[],
): ProjectStateEnum {
  console.log(containers, status);
  const state = containers.map(
    (container) => status.find((state) => state.name === container)?.state,
  );
  if (state.every((x) => x === 'running')) {
    return ProjectStateEnum.healthy;
  } else if (state.some((x) => x === 'running')) {
    return ProjectStateEnum.unhealthy;
  } else {
    return ProjectStateEnum.stopped;
  }
}

export { startDockerStatusPolling, getProjectStatus };
