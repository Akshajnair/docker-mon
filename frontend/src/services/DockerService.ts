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
  // if (containers.includes('vscode'))
  //   console.log(
  //     containers,
  //     state,
  //     state[0],
  //     ContainerStateEnum[ContainerStateEnum.running],
  //     state[0] === ContainerStateEnum.running,
  //   );
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

function getContainerStatus(
  container: string,
  status: IDockerServiceStatus[],
): ContainerStateEnum {
  console.log(
    container,
    status.find((state) => state.name === container)?.state,
  );
  return <ContainerStateEnum>(
    (status.find((state) => state.name === container)?.state as unknown)
  );
}

export { startDockerStatusPolling, getProjectStatus, getContainerStatus };
