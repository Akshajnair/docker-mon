import IDockerServiceStatus from '@models/interface/IDockerServiceStatus';
import { dockerApi } from 'reducers/api/DockerApiReducer';
import ContainerStateEnum from 'shared/enums/ContainerStateEnum';
import ProjectStateEnum from 'shared/enums/ProjectStateEnums';
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
  const state = containers.map(
    (container) => status.find((state) => state.name === container)?.state,
  );
  if (
    state.every((x) => (x as ContainerStateEnum) === ContainerStateEnum.running)
  ) {
    return ProjectStateEnum.healthy;
  } else if (
    state.some(
      (x) =>
        (x as ContainerStateEnum) ===
        ContainerStateEnum[ContainerStateEnum.running],
    )
  ) {
    return ProjectStateEnum.unhealthy;
  } else {
    return ProjectStateEnum.stopped;
  }
}

function getContainerState(status: IDockerServiceStatus): ContainerStateEnum {
  return <ContainerStateEnum>(status.state as unknown);
}

function getContainerCompleteStatus(
  container: string,
  status: IDockerServiceStatus[],
): IDockerServiceStatus {
  return status.find((state) => state.name === container);
}

export {
  startDockerStatusPolling,
  getProjectStatus,
  getContainerState,
  getContainerCompleteStatus,
};
