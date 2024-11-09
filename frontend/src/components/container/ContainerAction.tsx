import { Button } from '@chakra-ui/react';
import React from 'react';
import { RiPlayFill, RiStopFill } from 'react-icons/ri';
import {
  useGetStatusQuery,
  useStartContainerMutation,
  useStopContainerMutation,
} from 'reducers/api/DockerApiReducer';
import {
  getContainerCompleteStatus,
  getContainerState,
} from 'services/DockerService';
import ContainerStateEnum from 'shared/enums/ContainerStateEnum';

type ContainerActionProps = {
  containerName: string;
};

export default function ContainerAction(props: ContainerActionProps) {
  const { data: statuses } = useGetStatusQuery();
  const [stopContainer, { isLoading: containerStopLoading }] =
    useStopContainerMutation();

  const [startContainer, { isLoading: containerStartLoading }] =
    useStartContainerMutation();

  const containerStatus = getContainerCompleteStatus(
    props.containerName,
    statuses,
  );
  const containerState = getContainerState(containerStatus);

  function onContainerStopAction(containerId: string): void {
    if (containerId) {
      stopContainer(containerId);
    }
  }
  function onContainerStartAction(containerId: string): void {
    if (containerId) {
      startContainer(containerId);
    }
  }

  return containerState === ContainerStateEnum[ContainerStateEnum.running] ? (
    <Button
      colorScheme="red"
      variant="solid"
      onClick={() => onContainerStopAction(containerStatus.containerId)}
      isLoading={containerStopLoading}
      isDisabled={containerStopLoading}
    >
      <RiStopFill />
    </Button>
  ) : (
    <Button
      colorScheme="teal"
      variant="solid"
      onClick={() => onContainerStartAction(containerStatus.containerId)}
      isLoading={containerStartLoading}
      isDisabled={containerStartLoading}
    >
      <RiPlayFill />
    </Button>
  );
}
